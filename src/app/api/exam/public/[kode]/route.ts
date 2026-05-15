import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ kode: string }> }) {
  try {
    const { kode } = await params;
    const exam = await prismaClient.exam.findUnique({
      where: { kodeUjian: kode },
      include: {
        questions: {
          include: { choices: { orderBy: { label: "asc" } } },
          orderBy: { createdAt: "asc" },
        },
        _count: { select: { students: true } },
      },
    });

    if (!exam) {
      return NextResponse.json({ error: "Kode ujian tidak ditemukan" }, { status: 404 });
    }

    const now = new Date();
    const isAvailable = now >= exam.tanggalMulai && now <= exam.tanggalSelesai;

    return NextResponse.json({
      success: true,
      data: {
        id: exam.id,
        judul: exam.judul,
        mataPelajaran: exam.mataPelajaran,
        kodeUjian: exam.kodeUjian,
        tanggalMulai: exam.tanggalMulai,
        tanggalSelesai: exam.tanggalSelesai,
        jumlahSoal: exam.questions.length,
        isAvailable,
        questions: exam.questions.map((q) => ({
          id: q.id,
          pertanyaan: q.pertanyaan,
          point: q.point,
          jenis: q.jenis,
          choices: q.choices.map((c) => ({ label: c.label, teks: c.teks })),
        })),
      },
    });
  } catch (error) {
    console.error("Get public exam error:", error);
    return NextResponse.json({ error: "Failed to fetch exam" }, { status: 500 });
  }
}
