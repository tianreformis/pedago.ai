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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string; studentId: string }> }) {
  try {
    const { userId } = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, studentId } = await params;
    const exam = await prismaClient.exam.findUnique({ where: { id } });
    if (!exam || exam.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { questionId, score } = body;

    if (!questionId) {
      return NextResponse.json({ error: "Question ID required" }, { status: 400 });
    }
    if (score === undefined || score === null || score < 0) {
      return NextResponse.json({ error: "Score tidak valid" }, { status: 400 });
    }

    await prismaClient.examAnswer.update({
      where: { examStudentId_questionId: { examStudentId: studentId, questionId } },
      data: { score: parseInt(score) },
    });

    // Recalculate total score from all answer scores + essay defaults
    const answers = await prismaClient.examAnswer.findMany({
      where: { examStudentId: studentId },
      include: { question: { include: { choices: true } } },
    });

    let totalScore = 0;
    for (const a of answers) {
      if (a.score !== null) {
        totalScore += a.score;
      } else if (a.question.jenis === "pilihan_ganda") {
        const kj = a.question.kunciJawaban as Record<string, unknown> | null;
        if (a.jawaban === (kj?.pilihan as string)) {
          totalScore += a.question.point;
        }
      } else if (a.question.jenis === "multiple_answer") {
        try {
          const kj = a.question.kunciJawaban as Record<string, unknown> | null;
          const studentAns: string[] = JSON.parse(a.jawaban || "[]");
          const correct = (kj?.pilihan as string[]) || [];
          const allChoices = a.question.choices || [];
          const totalCorrect = correct.length;
          const totalWrong = allChoices.length - totalCorrect;
          const correctSelected = correct.filter((c: string) => studentAns.includes(c)).length;
          const wrongSelected = studentAns.filter((s: string) => !correct.includes(s)).length;
          if (totalCorrect > 0) {
            let ratio = correctSelected / totalCorrect;
            if (totalWrong > 0) ratio -= wrongSelected / totalWrong;
            totalScore += Math.round(Math.max(0, ratio) * a.question.point);
          }
        } catch { /* skip */ }
      }
    }

    await prismaClient.examStudent.update({
      where: { id: studentId },
      data: { score: totalScore },
    });

    return NextResponse.json({ success: true, totalScore });
  } catch (error) {
    console.error("Save answer score error:", error);
    return NextResponse.json({ error: "Failed to save answer score" }, { status: 500 });
  }
}
