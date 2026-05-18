import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { verifyToken, createToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest, { params }: { params: Promise<{ kode: string }> }) {
  try {
    const { kode } = await params;
    const authHeader = req.headers.get("authorization");
    const userToken = authHeader?.replace("Bearer ", "");
    if (!userToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(userToken);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await prismaClient.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const exam = await prismaClient.exam.findUnique({ where: { kodeUjian: kode } });
    if (!exam) {
      return NextResponse.json({ error: "Ujian tidak ditemukan" }, { status: 404 });
    }

    const now = new Date();
    const isOver = now > exam.tanggalSelesai;

    // Create or find global Student by email
    let student = await prismaClient.student.findUnique({ where: { email: user.email } });
    if (!student) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      student = await prismaClient.student.create({
        data: { email: user.email, nama: user.name || user.email, password: hashedPassword },
      });
    }

    // Create or find ExamStudent for this exam
    let examStudent = await prismaClient.examStudent.findUnique({
      where: { examId_username: { examId: exam.id, username: user.email } },
    });

    if (!examStudent) {
      if (isOver) {
        return NextResponse.json({ error: "Ujian sudah berakhir" }, { status: 400 });
      }
      examStudent = await prismaClient.examStudent.create({
        data: { examId: exam.id, studentId: student.id, nama: user.name || user.email, username: user.email, password: student.password },
      });
    }

    const token = createToken(student.id, student.email, false, "student");

    return NextResponse.json({
      success: true,
      data: {
        studentId: examStudent.id,
        globalStudentId: student.id,
        nama: student.nama,
        username: student.email,
        token,
        startedAt: examStudent.startedAt,
        submittedAt: examStudent.submittedAt,
      },
    });
  } catch (error) {
    console.error("Auto-auth error:", error);
    return NextResponse.json({ error: "Auto-auth failed" }, { status: 500 });
  }
}
