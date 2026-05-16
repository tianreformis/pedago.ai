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
    if (!decoded || decoded.type !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const student = await prismaClient.student.findUnique({
      where: { id: decoded.userId },
      include: {
        examStudents: {
          include: {
            exam: { select: { id: true, judul: true, mataPelajaran: true, kodeUjian: true, tanggalMulai: true, tanggalSelesai: true } },
            _count: { select: { answers: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const exams = student.examStudents.map((es) => ({
      examId: es.exam.id,
      judul: es.exam.judul,
      mataPelajaran: es.exam.mataPelajaran,
      kodeUjian: es.exam.kodeUjian,
      tanggalMulai: es.exam.tanggalMulai,
      tanggalSelesai: es.exam.tanggalSelesai,
      startedAt: es.startedAt,
      submittedAt: es.submittedAt,
      score: es.score,
      scoreReleased: es.scoreReleased,
      answerCount: es._count.answers,
    }));

    return NextResponse.json({ success: true, data: { nama: student.nama, email: student.email, exams } });
  } catch (error) {
    console.error("Student exams error:", error);
    return NextResponse.json({ error: "Failed to fetch exams" }, { status: 500 });
  }
}
