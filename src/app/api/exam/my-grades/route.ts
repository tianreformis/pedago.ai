import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await prismaClient.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const student = await prismaClient.student.findUnique({ where: { email: user.email } });
    if (!student) {
      return NextResponse.json({ success: true, data: { nama: user.name, email: user.email, exams: [] } });
    }

    const examStudents = await prismaClient.examStudent.findMany({
      where: { studentId: student.id },
      include: {
        exam: {
          select: { id: true, judul: true, mataPelajaran: true, kodeUjian: true, tanggalMulai: true, tanggalSelesai: true },
        },
        _count: { select: { answers: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const exams = examStudents.map((es) => ({
      examId: es.exam.id,
      judul: es.exam.judul,
      mataPelajaran: es.exam.mataPelajaran,
      kodeUjian: es.exam.kodeUjian,
      tanggalMulai: es.exam.tanggalMulai.toISOString(),
      tanggalSelesai: es.exam.tanggalSelesai.toISOString(),
      startedAt: es.startedAt.toISOString(),
      submittedAt: es.submittedAt?.toISOString() || null,
      score: es.score,
      scoreReleased: es.scoreReleased,
      answerCount: es._count.answers,
    }));

    return NextResponse.json({
      success: true,
      data: { nama: student.nama, email: student.email, exams },
    });
  } catch (error) {
    console.error("My grades error:", error);
    return NextResponse.json({ error: "Failed to fetch grades" }, { status: 500 });
  }
}
