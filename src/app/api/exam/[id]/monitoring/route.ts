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

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const students = await prismaClient.examStudent.findMany({
      where: { examId: id },
      include: {
        _count: { select: { answers: true } },
        answers: {
          include: {
            question: {
              include: { choices: { orderBy: { label: "asc" } } },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const totalQuestions = await prismaClient.examQuestion.count({
      where: { examId: id },
    });

    function evaluateAnswer(jenis: string, jawaban: string, kunciJawaban: unknown): boolean {
      if (!kunciJawaban) return false;
      const kj = kunciJawaban as Record<string, unknown>;
      if (jenis === "essay") return false;
      if (jenis === "pilihan_ganda") {
        return jawaban === kj.pilihan;
      }
      if (jenis === "multiple_answer") {
        try {
          const studentAnswers = JSON.parse(jawaban || "[]");
          const correct = kj.pilihan as string[] || [];
          if (!Array.isArray(studentAnswers) || !Array.isArray(correct)) return false;
          if (studentAnswers.length !== correct.length) return false;
          return correct.every((c: string) => studentAnswers.includes(c));
        } catch {
          return false;
        }
      }
      return false;
    }

    const data = students.map((s) => ({
      id: s.id,
      nama: s.nama,
      username: s.username,
      startedAt: s.startedAt,
      submittedAt: s.submittedAt,
      tabSwitchCount: s.tabSwitchCount,
      score: s.score,
      scoreReleased: s.scoreReleased,
      answeredCount: s._count.answers,
      totalQuestions,
      answers: s.answers.map((a) => ({
        questionId: a.questionId,
        jenis: a.question.jenis,
        pertanyaan: a.question.pertanyaan,
        point: a.question.point,
        kunciJawaban: a.question.kunciJawaban,
        choices: a.question.choices.map((c) => ({ label: c.label, teks: c.teks })),
        jawaban: a.jawaban,
        score: a.score,
        isCorrect: evaluateAnswer(a.question.jenis, a.jawaban, a.question.kunciJawaban),
      })),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Monitoring error:", error);
    return NextResponse.json({ error: "Failed to fetch monitoring data" }, { status: 500 });
  }
}
