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

    const questions = await prismaClient.examQuestion.findMany({
      where: { examId: id },
      include: { choices: true },
      orderBy: { createdAt: "asc" },
    });

    const students = await prismaClient.examStudent.findMany({
      where: { examId: id, submittedAt: { not: null } },
      include: { answers: true },
    });

    if (students.length === 0) {
      return NextResponse.json({ error: "Belum ada siswa yang mengumpulkan" }, { status: 400 });
    }

    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const results: {
      nama: string;
      username: string;
      kemampuanTinggi: string[];
      kemampuanKurang: string[];
      rekomendasi: string;
    }[] = [];

    for (const student of students) {
      const soalData = questions.map((q, i) => {
        const answer = student.answers.find((a) => a.questionId === q.id);
        const jawaban = answer?.jawaban || "(Tidak dijawab)";
        let isCorrect = false;
        if (q.jenis === "pilihan_ganda") {
          const kj = q.kunciJawaban as Record<string, unknown> | null;
          isCorrect = jawaban === (kj?.pilihan as string);
        } else if (q.jenis === "multiple_answer") {
          try {
            const kj = q.kunciJawaban as Record<string, unknown> | null;
            const studentAns: string[] = JSON.parse(jawaban || "[]");
            const correct = (kj?.pilihan as string[]) || [];
            isCorrect = correct.length > 0 && correct.every((c) => studentAns.includes(c)) && studentAns.length === correct.length;
          } catch { isCorrect = false; }
        }
        return `Soal ${i + 1}: ${q.pertanyaan}
Jawaban siswa: ${jawaban}
Benar: ${isCorrect ? "Ya" : "Tidak"}
${q.jenis !== "essay" ? `Pilihan: ${q.choices.map((c) => `${c.label}. ${c.teks}`).join(", ")}` : ""}`;
      }).join("\n\n");

      const prompt = `Analisis kemampuan siswa berdasarkan hasil ujian berikut:

Mata Pelajaran: ${exam.mataPelajaran}
Judul Ujian: ${exam.judul}
Nama Siswa: ${student.nama}

${soalData}

Berdasarkan data di atas, berikan analisis dalam format JSON (tanpa markdown, tanpa teks lain):
{
  "kemampuanTinggi": ["topik/materi yang sudah dikuasai siswa"],
  "kemampuanKurang": ["topik/materi yang masih perlu ditingkatkan"],
  "rekomendasi": "rekomendasi singkat untuk guru"
}

Infer topik/materi dari konten soal. Jika semua soal terjawab benar, kemampuanKurang bisa kosong. Jika semua salah, kemampuanTinggi bisa kosong.`;

      const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: process.env.MISTRAL_MODEL || "mistral-large-latest",
          temperature: 0.3,
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) {
        results.push({
          nama: student.nama,
          username: student.username,
          kemampuanTinggi: [],
          kemampuanKurang: [],
          rekomendasi: "Gagal menganalisis",
        });
        continue;
      }

      const data = await response.json();
      let content = data.choices?.[0]?.message?.content || "";
      content = content.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();

      try {
        const parsed = JSON.parse(content);
        results.push({
          nama: student.nama,
          username: student.username,
          kemampuanTinggi: Array.isArray(parsed.kemampuanTinggi) ? parsed.kemampuanTinggi : [],
          kemampuanKurang: Array.isArray(parsed.kemampuanKurang) ? parsed.kemampuanKurang : [],
          rekomendasi: parsed.rekomendasi || "",
        });
      } catch {
        results.push({
          nama: student.nama,
          username: student.username,
          kemampuanTinggi: [],
          kemampuanKurang: [],
          rekomendasi: content.slice(0, 500),
        });
      }
    }

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json({ error: "Failed to analyze" }, { status: 500 });
  }
}
