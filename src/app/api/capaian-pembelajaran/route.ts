import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { jenjangKelasToFaseNames } from "@/lib/fase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mataPelajaran = searchParams.get("mataPelajaran");
    const jenjang = searchParams.get("jenjang");
    const kelas = searchParams.get("kelas");

    if (!mataPelajaran) {
      return NextResponse.json({ success: true, data: [] });
    }

    const faseNames = jenjang && kelas ? jenjangKelasToFaseNames(jenjang, kelas) : null;

    const subject = await prismaClient.mataPelajaran.findFirst({
      where: { nama: mataPelajaran },
      include: {
        fases: {
          ...(faseNames && { where: { nama: { in: faseNames } } }),
          include: {
            capaianPembelajarans: {
              select: { id: true, nama: true, deskripsi: true },
            },
          },
        },
      },
    });

    if (!subject) {
      return NextResponse.json({ success: true, data: [] });
    }

    const cpList = subject.fases.flatMap((f) => f.capaianPembelajarans);
    return NextResponse.json({ success: true, data: cpList });
  } catch (error) {
    console.error("Get CP error:", error);
    return NextResponse.json({ error: "Failed to fetch CP" }, { status: 500 });
  }
}
