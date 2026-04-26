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

    const { nama, deskripsi, faseId } = await req.json();
    if (!nama?.trim() || !deskripsi?.trim() || !faseId) {
      return NextResponse.json({ error: "Nama, Deskripsi, dan Fase wajib diisi" }, { status: 400 });
    }

    const cp = await prismaClient.capaianPembelajaran.create({
      data: { nama, deskripsi, faseId },
    });

    return NextResponse.json({ success: true, data: cp });
  } catch (error) {
    console.error("Create CP error:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}