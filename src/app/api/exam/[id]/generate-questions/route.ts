import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

function getUserId(req: NextRequest): { userId: string | null; isAdmin: boolean } {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return { userId: null, isAdmin: false };
  const decoded = verifyToken(token);
  return { userId: decoded?.userId || null, isAdmin: decoded?.isAdmin === true };
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId, isAdmin } = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const exam = await prismaClient.exam.findUnique({ where: { id } });
    if (!exam || (exam.userId !== userId && !isAdmin)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { jumlah, materi, jenis, cp, jumlahPilihan } = body;
    const count = Math.min(Math.max(parseInt(jumlah) || 5, 1), 10);
    const questionType = jenis || "essay";
    const pilihanCount = Math.min(Math.max(parseInt(jumlahPilihan) || 4, 3), 10);

    if (!["essay", "pilihan_ganda", "multiple_answer", "true_false"].includes(questionType)) {
      return NextResponse.json({ error: "Jenis soal tidak valid" }, { status: 400 });
    }

    const choiceLabels = Array.from({ length: pilihanCount }, (_, i) => String.fromCharCode(97 + i));

    let formatInstructions: string;
    if (questionType === "essay") {
      formatInstructions = `Format output JSON array:
[
  { "pertanyaan": "teks soal", "point": 10, "kunciJawaban": { "text": "jawaban yang diharapkan" } }
]`;
    } else if (questionType === "pilihan_ganda") {
      const exampleChoices = choiceLabels.map((l) => `      { "label": "${l}", "teks": "pilihan ${l.toUpperCase()}" }`).join(",\n");
      formatInstructions = `Buat ${pilihanCount} pilihan jawaban (${choiceLabels.join(", ")}) untuk setiap soal. Tentukan satu jawaban benar.
Format output JSON array:
[
  {
    "pertanyaan": "teks soal",
    "point": 10,
    "choices": [
${exampleChoices}
    ],
    "kunciJawaban": { "pilihan": "${choiceLabels[0]}" }
  }
]`;
    } else if (questionType === "true_false") {
      formatInstructions = `Buat soal dengan 2 pilihan jawaban: "benar" (berarti pernyataan benar) dan "salah" (berarti pernyataan salah). Tentukan jawaban yang benar.
Format output JSON array:
[
  {
    "pertanyaan": "teks soal",
    "point": 10,
    "choices": [
      { "label": "benar", "teks": "Benar" },
      { "label": "salah", "teks": "Salah" }
    ],
    "kunciJawaban": { "pilihan": "benar" }
  }
]`;
    } else {
      const exampleChoices = choiceLabels.map((l) => `      { "label": "${l}", "teks": "pilihan ${l.toUpperCase()}" }`).join(",\n");
      formatInstructions = `Buat ${pilihanCount} pilihan jawaban (${choiceLabels.join(", ")}) untuk setiap soal. Tentukan jawaban benar bisa lebih dari satu.
Format output JSON array:
[
  {
    "pertanyaan": "teks soal",
    "point": 10,
    "choices": [
${exampleChoices}
    ],
    "kunciJawaban": { "pilihan": ["${choiceLabels[0]}"] }
  }
]`;
    }

    let cpContext = "";
    if (cp) {
      cpContext = `\nCapaian Pembelajaran: ${cp}`;
    }

    const prompt = `Buatkan ${count} soal ujian tipe ${questionType} untuk mata pelajaran ${exam.mataPelajaran}${materi ? ` tentang materi: ${materi}` : ""}${cpContext}.

${formatInstructions}

Setiap soal harus jelas dan memiliki point minimal 10.
Kembalikan HANYA JSON array, tanpa markdown, tanpa teks lain.`;

    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.MISTRAL_MODEL || "mistral-large-latest",
        temperature: 0.3,
        max_tokens: 8000,
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "";
    content = content.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();

    let questions: Record<string, unknown>[];
    try {
      const parsed = JSON.parse(content);
      questions = Array.isArray(parsed) ? parsed : (parsed.questions || []);
    } catch {
      const match = content.match(/\[[\s\S]*\]/);
      if (match) {
        questions = JSON.parse(match[0]);
      } else {
        return NextResponse.json({ error: "Gagal memproses output AI" }, { status: 500 });
      }
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: "AI tidak menghasilkan soal" }, { status: 500 });
    }

    const created = [];
    for (const q of questions) {
      const questionData: Record<string, unknown> = {
        examId: id,
        pertanyaan: q.pertanyaan as string,
        point: Math.max((q.point as number) || 10, 1),
        jenis: questionType,
        kunciJawaban: q.kunciJawaban || null,
      };

      const question = await prismaClient.examQuestion.create({
        data: questionData as any,
      });

      if (q.choices && Array.isArray(q.choices) && (questionType === "pilihan_ganda" || questionType === "multiple_answer" || questionType === "true_false")) {
        const choiceData = (q.choices as { label: string; teks: string }[]).map((c) => ({
          questionId: question.id,
          label: c.label,
          teks: c.teks,
        }));
        await prismaClient.examQuestionChoice.createMany({ data: choiceData });
      }

      const fullQuestion = await prismaClient.examQuestion.findUnique({
        where: { id: question.id },
        include: { choices: { orderBy: { label: "asc" } } },
      });
      created.push(fullQuestion);
    }

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error("Generate questions error:", error);
    return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 });
  }
}
