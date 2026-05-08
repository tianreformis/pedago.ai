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

    const promes = await prismaClient.promes.findMany({
      where: isAdmin ? {} : { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: promes });
  } catch (error) {
    console.error("Get Promes error:", error);
    return NextResponse.json({ error: "Failed to fetch Promes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { mataPelajaran, fase, kelas, namaGuru, sekolah, tahunAjaran, semester, jpPerMinggu, rawOutput } = body;

    if (!mataPelajaran || !fase || !semester) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const promes = await prismaClient.promes.create({
      data: {
        userId,
        mataPelajaran,
        fase,
        kelas: kelas || null,
        namaGuru: namaGuru || null,
        sekolah: sekolah || null,
        tahunAjaran: tahunAjaran || null,
        semester,
        jpPerMinggu: jpPerMinggu || null,
        rawOutput,
      },
    });

    return NextResponse.json({ success: true, data: promes });
  } catch (error) {
    console.error("Create Promes error:", error);
    return NextResponse.json({ error: "Failed to save Promes" }, { status: 500 });
  }
}
