import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

function getUserId(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return null;
  const decoded = verifyToken(token);
  return decoded?.userId || null;
}

export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: { name: true, subscriptionStatus: true, subscriptionExpiry: true },
    });

    const rpps = await prismaClient.rPP.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: rpps, user });
  } catch (error) {
    console.error("Get RPPs error:", error);
    return NextResponse.json({ error: "Failed to fetch RPPs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { mataPelajaran, fase, kelas, namaGuru, sekolah, tahunAjaran, semester, alokasWaktu, rawOutput } = body;

    if (!mataPelajaran || !fase) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const rpp = await prismaClient.rPP.create({
      data: {
        userId,
        mataPelajaran,
        fase,
        kelas,
        namaGuru,
        sekolah,
        tahunAjaran,
        semester,
        alokasWaktu,
        rawOutput,
      },
    });

    return NextResponse.json({ success: true, data: rpp });
  } catch (error) {
    console.error("Create RPP error:", error);
    return NextResponse.json({ error: "Failed to save RPP" }, { status: 500 });
  }
}