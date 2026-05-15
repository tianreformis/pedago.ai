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

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string; studentId: string }> }) {
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

    const student = await prismaClient.examStudent.findUnique({
      where: { id: studentId },
      include: {
        answers: {
          include: { question: true },
        },
      },
    });

    if (!student || student.examId !== id) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: student.id,
        nama: student.nama,
        username: student.username,
        startedAt: student.startedAt,
        submittedAt: student.submittedAt,
        tabSwitchCount: student.tabSwitchCount,
        score: student.score,
        scoreReleased: student.scoreReleased,
        answers: student.answers.map((a) => ({
          questionId: a.questionId,
          pertanyaan: a.question.pertanyaan,
          point: a.question.point,
          jawaban: a.jawaban,
        })),
      },
    });
  } catch (error) {
    console.error("Get student detail error:", error);
    return NextResponse.json({ error: "Failed to fetch student data" }, { status: 500 });
  }
}
