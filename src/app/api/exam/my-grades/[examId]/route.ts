import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest, { params }: { params: Promise<{ examId: string }> }) {
  try {
    const { examId } = await params;
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
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const examStudent = await prismaClient.examStudent.findUnique({
      where: { examId_username: { examId, username: user.email } },
      include: { answers: true },
    });

    if (!examStudent) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    const exam = await prismaClient.exam.findUnique({
      where: { id: examId },
      include: {
        questions: {
          include: { choices: { orderBy: { label: "asc" } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    const answersMap = new Map(examStudent.answers.map((a) => [a.questionId, a.jawaban]));

    const questions = exam.questions.map((q) => {
      const jawabanSiswa = answersMap.get(q.id) || null;
      const kj = q.kunciJawaban as Record<string, unknown> | null;
      let isCorrect = false;

      if (q.jenis === "pilihan_ganda" || q.jenis === "true_false") {
        isCorrect = jawabanSiswa === (kj?.pilihan as string);
      } else if (q.jenis === "multiple_answer" && kj?.pilihan) {
        try {
          const studentAns = JSON.parse(jawabanSiswa || "[]") as string[];
          const correct = kj.pilihan as string[];
          isCorrect = correct.length === studentAns.length && correct.every((c) => studentAns.includes(c));
        } catch {
          isCorrect = false;
        }
      }

      return {
        id: q.id,
        pertanyaan: q.pertanyaan,
        point: q.point,
        jenis: q.jenis,
        choices: q.choices.map((c) => ({ label: c.label, teks: c.teks })),
        kunciJawaban: q.kunciJawaban,
        jawabanSiswa,
        isCorrect,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        judul: exam.judul,
        mataPelajaran: exam.mataPelajaran,
        kodeUjian: exam.kodeUjian,
        tanggalMulai: exam.tanggalMulai,
        tanggalSelesai: exam.tanggalSelesai,
        submittedAt: examStudent.submittedAt,
        score: examStudent.score,
        scoreReleased: examStudent.scoreReleased,
        questions,
      },
    });
  } catch (error) {
    console.error("My grade detail error:", error);
    return NextResponse.json({ error: "Failed to fetch exam details" }, { status: 500 });
  }
}
