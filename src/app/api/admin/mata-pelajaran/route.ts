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

    const { nama } = await req.json();
    if (!nama?.trim()) {
      return NextResponse.json({ error: "Nama wajib diisi" }, { status: 400 });
    }

    const mataPelajaran = await prismaClient.mataPelajaran.create({
      data: { nama },
    });

    return NextResponse.json({ success: true, data: mataPelajaran });
  } catch (error) {
    console.error("Create Mata Pelajaran error:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}