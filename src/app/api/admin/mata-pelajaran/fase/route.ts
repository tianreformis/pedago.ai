import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload?.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { nama, keterangan, mataPelajaranId } = await req.json();
    if (!nama?.trim() || !mataPelajaranId) {
      return NextResponse.json({ error: "Nama dan Mata Pelajaran wajib diisi" }, { status: 400 });
    }

    const fase = await prismaClient.fase.create({
      data: { nama, keterangan, mataPelajaranId },
    });

    return NextResponse.json({ success: true, data: fase });
  } catch (error) {
    console.error("Create Fase error:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}