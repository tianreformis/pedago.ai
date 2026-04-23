import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

function getUserId(req: NextRequest): { userId: string | null; isAdmin: boolean } {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return { userId: null, isAdmin: false };
  const decoded = verifyToken(token);
  return { userId: decoded?.userId || null, isAdmin: decoded?.isAdmin === true };
}

export async function GET(req: NextRequest) {
  try {
    const { userId, isAdmin } = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const protas = await prismaClient.prota.findMany({
      where: isAdmin ? {} : { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: protas });
  } catch (error) {
    console.error("Get Protas error:", error);
    return NextResponse.json({ error: "Failed to fetch Protas" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { mataPelajaran, fase, kelas, namaGuru, sekolah, tahunAjaran, rawOutput } = body;

    if (!mataPelajaran || !fase) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prota = await prismaClient.prota.create({
      data: {
        userId,
        mataPelajaran,
        fase,
        kelas: kelas || [],
        namaGuru: namaGuru || null,
        sekolah: sekolah || null,
        tahunAjaran: tahunAjaran || null,
        rawOutput,
      },
    });

    return NextResponse.json({ success: true, data: prota });
  } catch (error) {
    console.error("Create Prota error:", error);
    return NextResponse.json({ error: "Failed to save Prota" }, { status: 500 });
  }
}