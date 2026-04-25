import { NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";

export async function GET() {
  try {
    const mataPelajaran = await prismaClient.mataPelajaran.findMany({
      include: {
        fases: {
          include: {
            capaianPembelajarans: {
              orderBy: { nama: "asc" },
            },
          },
          orderBy: { nama: "asc" },
        },
      },
      orderBy: { nama: "asc" },
    });

    return NextResponse.json({ success: true, data: mataPelajaran });
  } catch (error) {
    console.error("Get Mata Pelajaran error:", error);
    return NextResponse.json({ error: "Failed to fetch Mata Pelajaran" }, { status: 500 });
  }
}