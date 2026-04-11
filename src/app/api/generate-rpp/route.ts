import { NextRequest, NextResponse } from "next/server";
import { generateRPP } from "@/lib/mistral";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mataPelajaran, fase, kelas, namaGuru, sekolah, tahunAjaran, semester, alokasWaktu } = body;

    if (!mataPelajaran || !fase) {
      return NextResponse.json(
        { error: "Mata pelajaran dan fase wajib diisi" },
        { status: 400 }
      );
    }

    const rppOutput = await generateRPP({
      mataPelajaran,
      fase,
      kelas,
      namaGuru,
      sekolah,
      tahunAjaran,
      semester,
      alokasWaktu,
    });

    return NextResponse.json({ success: true, data: rppOutput });
  } catch (error) {
    console.error("Generate RPP error:", error);
    return NextResponse.json(
      { error: "Gagal generate RPP. Silakan coba lagi." },
      { status: 500 }
    );
  }
}