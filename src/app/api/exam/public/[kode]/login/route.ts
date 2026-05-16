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

      // Create or find global Student by email (username)
      let student = await prismaClient.student.findUnique({ where: { email: username } });
      if (!student) {
        const hashedPassword = await bcrypt.hash(password, 10);
        student = await prismaClient.student.create({
          data: { email: username, nama, password: hashedPassword },
        });
      } else {
        // Verify password matches existing account
        const valid = await bcrypt.compare(password, student.password);
        if (!valid) {
          return NextResponse.json({ error: "Email sudah terdaftar dengan password berbeda" }, { status: 400 });
        }
      }

      // Create or find ExamStudent record for this exam
      let examStudent = await prismaClient.examStudent.findUnique({
        where: { examId_username: { examId: exam.id, username } },
      });

      if (examStudent) {
        // Already registered for this exam
        const token = createToken(student.id, student.email, false, "student");
        return NextResponse.json({
          success: true,
          data: {
            studentId: examStudent.id,
            globalStudentId: student.id,
            nama: examStudent.nama,
            username: examStudent.username,
            token,
            startedAt: examStudent.startedAt,
          },
        });
      }

      examStudent = await prismaClient.examStudent.create({
        data: { examId: exam.id, studentId: student.id, nama, username, password: student.password },
      });

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
        },
      });
    }

    if (action === "login") {
      if (!username || !password) {
        return NextResponse.json({ error: "Email dan password harus diisi" }, { status: 400 });
      }

      // Authenticate against global Student table
      const student = await prismaClient.student.findUnique({ where: { email: username } });
      if (!student) {
        return NextResponse.json({ error: "Email tidak terdaftar" }, { status: 400 });
      }

      const validPassword = await bcrypt.compare(password, student.password);
      if (!validPassword) {
        return NextResponse.json({ error: "Password salah" }, { status: 400 });
      }

      // Find or create ExamStudent for this exam
      let examStudent = await prismaClient.examStudent.findUnique({
        where: { examId_username: { examId: exam.id, username } },
      });

      if (!examStudent) {
        // Allow login even after exam ends to see results
        examStudent = await prismaClient.examStudent.create({
          data: { examId: exam.id, studentId: student.id, nama: student.nama, username: student.email, password: student.password },
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
        },
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Exam login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
