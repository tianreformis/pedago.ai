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

    // Auto-calculate scores for students who have null score before releasing
    const studentsWithoutScore = await prismaClient.examStudent.findMany({
      where: { examId: id, submittedAt: { not: null }, score: null },
      include: { answers: true },
    });

    const allQuestions = await prismaClient.examQuestion.findMany({
      where: { examId: id },
      include: { choices: true },
    });

    for (const student of studentsWithoutScore) {
      let totalScore = 0;
      for (const question of allQuestions) {
        const answer = student.answers.find((a) => a.questionId === question.id);
        if (!answer) continue;

        if (question.jenis === "pilihan_ganda") {
          const kj = question.kunciJawaban as Record<string, unknown> | null;
          if (answer.jawaban === (kj?.pilihan as string)) {
            totalScore += question.point;
          }
        } else if (question.jenis === "multiple_answer") {
          try {
            const kj = question.kunciJawaban as Record<string, unknown> | null;
            const studentAnswers: string[] = JSON.parse(answer.jawaban || "[]");
            const correct = (kj?.pilihan as string[]) || [];
            const allChoices = question.choices || [];
            const totalCorrect = correct.length;
            const totalWrong = allChoices.length - totalCorrect;
            const correctSelected = correct.filter((c: string) => studentAnswers.includes(c)).length;
            const wrongSelected = studentAnswers.filter((s: string) => !correct.includes(s)).length;

            if (totalCorrect > 0) {
              let ratio = correctSelected / totalCorrect;
              if (totalWrong > 0) ratio -= wrongSelected / totalWrong;
              totalScore += Math.round(Math.max(0, ratio) * question.point);
            }
          } catch { /* skip */ }
        }
      }

      await prismaClient.examStudent.update({
        where: { id: student.id },
        data: { score: totalScore },
      });
    }

    // Now release scores for all submitted students
    const result = await prismaClient.examStudent.updateMany({
      where: { examId: id, submittedAt: { not: null } },
      data: { scoreReleased: true },
    });

    return NextResponse.json({ success: true, count: result.count });
  } catch (error) {
    console.error("Release all scores error:", error);
    return NextResponse.json({ error: "Failed to release scores" }, { status: 500 });
  }
}
