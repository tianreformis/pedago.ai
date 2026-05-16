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

    const globalStudentId = decoded.userId;

    const globalStudent = await prismaClient.student.findUnique({ where: { id: globalStudentId } });
    if (!globalStudent) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const exam = await prismaClient.exam.findUnique({ where: { kodeUjian: kode } });
    if (!exam) {
      return NextResponse.json({ error: "Ujian tidak ditemukan" }, { status: 404 });
    }

    const examStudent = await prismaClient.examStudent.findUnique({
      where: { examId_username: { examId: exam.id, username: globalStudent.email } },
      include: { answers: true },
    });

    if (!examStudent) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const answersMap: Record<string, string> = {};
    for (const a of examStudent.answers) {
      answersMap[a.questionId] = a.jawaban;
    }

    return NextResponse.json({
      success: true,
      data: {
        studentId: examStudent.id,
        nama: examStudent.nama,
        startedAt: examStudent.startedAt,
        submittedAt: examStudent.submittedAt,
        score: examStudent.score,
        scoreReleased: examStudent.scoreReleased,
        answers: answersMap,
      },
    });
  } catch (error) {
    console.error("Get student status error:", error);
    return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
  }
}
