import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(req: NextRequest, { params }: { params: Promise<{ kode: string }> }) {
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
    });

    if (!examStudent) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (examStudent.submittedAt) {
      return NextResponse.json({ error: "Ujian sudah dikumpulkan" }, { status: 400 });
    }

    const now = new Date();
    if (now < exam.tanggalMulai || now > exam.tanggalSelesai) {
      return NextResponse.json({ error: "Ujian tidak sedang berlangsung" }, { status: 400 });
    }

    const body = await req.json();
    const { questionId, jawaban } = body;

    if (!questionId) {
      return NextResponse.json({ error: "Question ID required" }, { status: 400 });
    }

    const question = await prismaClient.examQuestion.findUnique({
      where: { id: questionId },
    });

    if (!question || question.examId !== exam.id) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const answer = await prismaClient.examAnswer.upsert({
      where: { examStudentId_questionId: { examStudentId: examStudent.id, questionId } },
      update: { jawaban: jawaban || "" },
      create: { examStudentId: examStudent.id, questionId, jawaban: jawaban || "" },
    });

    return NextResponse.json({ success: true, data: answer });
  } catch (error) {
    console.error("Save answer error:", error);
    return NextResponse.json({ error: "Failed to save answer" }, { status: 500 });
  }
}
