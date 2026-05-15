import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest, { params }: { params: Promise<{ kode: string }> }) {
  try {
    const { kode } = await params;
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const studentId = decoded.userId;
    const student = await prismaClient.examStudent.findUnique({
      where: { id: studentId },
      include: { exam: true, answers: true },
    });

    if (!student || student.exam.kodeUjian !== kode) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const answersMap: Record<string, string> = {};
    for (const a of student.answers) {
      answersMap[a.questionId] = a.jawaban;
    }

    return NextResponse.json({
      success: true,
      data: {
        studentId: student.id,
        nama: student.nama,
        startedAt: student.startedAt,
        submittedAt: student.submittedAt,
        score: student.score,
        scoreReleased: student.scoreReleased,
        answers: answersMap,
      },
    });
  } catch (error) {
    console.error("Get student status error:", error);
    return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
  }
}
