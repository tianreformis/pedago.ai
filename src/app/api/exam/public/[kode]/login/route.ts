import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/jwt";

export async function POST(req: NextRequest, { params }: { params: Promise<{ kode: string }> }) {
  try {
    const { kode } = await params;
    const body = await req.json();
    const { nama, username, password, action } = body;

    const exam = await prismaClient.exam.findUnique({
      where: { kodeUjian: kode },
    });

    if (!exam) {
      return NextResponse.json({ error: "Kode ujian tidak ditemukan" }, { status: 404 });
    }

    const now = new Date();
    const isOver = now > exam.tanggalSelesai;
    const isBefore = now < exam.tanggalMulai;

    if (action === "register") {
      if (isBefore) {
        return NextResponse.json({ error: "Ujian belum dimulai" }, { status: 400 });
      }
      if (isOver) {
        return NextResponse.json({ error: "Ujian sudah berakhir, tidak bisa mendaftar" }, { status: 400 });
      }

      if (!nama || !username || !password) {
        return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 });
      }

      const existing = await prismaClient.examStudent.findUnique({
        where: { examId_username: { examId: exam.id, username } },
      });

      if (existing) {
        return NextResponse.json({ error: "Username sudah digunakan" }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const student = await prismaClient.examStudent.create({
        data: { examId: exam.id, nama, username, password: hashedPassword },
      });

      const token = createToken(student.id, `student-${username}`, false);

      return NextResponse.json({
        success: true,
        data: {
          studentId: student.id,
          nama: student.nama,
          username: student.username,
          token,
          startedAt: student.startedAt,
        },
      });
    }

    if (action === "login") {
      if (!username || !password) {
        return NextResponse.json({ error: "Username dan password harus diisi" }, { status: 400 });
      }

      const student = await prismaClient.examStudent.findUnique({
        where: { examId_username: { examId: exam.id, username } },
      });

      if (!student) {
        return NextResponse.json({ error: "Username tidak terdaftar" }, { status: 400 });
      }

      const validPassword = await bcrypt.compare(password, student.password);
      if (!validPassword) {
        return NextResponse.json({ error: "Password salah" }, { status: 400 });
      }

      const token = createToken(student.id, `student-${username}`, false);

      return NextResponse.json({
        success: true,
        data: {
          studentId: student.id,
          nama: student.nama,
          username: student.username,
          token,
          startedAt: student.startedAt,
        },
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Exam login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
