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
    });

    const students = await prismaClient.examStudent.findMany({
      where: { examId: id },
      include: { answers: true },
    });

    const questionsMap = new Map(questions.map((q) => [q.id, q]));

    const results: { studentId: string; nama: string; score: number }[] = [];

    for (const student of students) {
      let totalScore = 0;

      for (const question of questions) {
        const answer = student.answers.find((a) => a.questionId === question.id);
        if (!answer) continue;

        const jenis = question.jenis;
        const point = question.point;
        const kj = question.kunciJawaban as Record<string, unknown> | null;

        if (jenis === "essay") {
          continue; // essay score stays 0, teacher grades manually
        }

        if (jenis === "pilihan_ganda") {
          if (answer.jawaban === (kj?.pilihan as string)) {
            totalScore += point;
          }
          continue;
        }

        if (jenis === "multiple_answer") {
          try {
            const studentAnswers: string[] = JSON.parse(answer.jawaban || "[]");
            const correct = (kj?.pilihan as string[]) || [];
            const allChoices = question.choices || [];
            const totalCorrect = correct.length;
            const totalWrong = allChoices.length - totalCorrect;

            const correctSelected = correct.filter((c: string) => studentAnswers.includes(c)).length;
            const wrongSelected = studentAnswers.filter((s: string) => !correct.includes(s)).length;

            if (totalCorrect === 0) continue;

            let ratio = correctSelected / totalCorrect;
            if (totalWrong > 0) {
              ratio -= wrongSelected / totalWrong;
            }
            ratio = Math.max(0, ratio);
            totalScore += Math.round(ratio * point);
          } catch {
            // skip on error
          }
        }
      }

      totalScore = Math.min(totalScore, questions.reduce((s, q) => s + q.point, 0));

      await prismaClient.examStudent.update({
        where: { id: student.id },
        data: { score: totalScore },
      });

      results.push({ studentId: student.id, nama: student.nama, score: totalScore });
    }

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error("Calculate scores error:", error);
    return NextResponse.json({ error: "Failed to calculate scores" }, { status: 500 });
  }
}
