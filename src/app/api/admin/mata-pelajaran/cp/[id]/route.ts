import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload?.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    await prismaClient.capaianPembelajaran.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete CP error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload?.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const { nama, deskripsi } = await req.json();

    const data = await prismaClient.capaianPembelajaran.update({
      where: { id },
      data: { nama, deskripsi },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Update CP error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}