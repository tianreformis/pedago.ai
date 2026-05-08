import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const promes = await prismaClient.promes.findUnique({ where: { id } });
    if (!promes) return NextResponse.json({ error: "Promes tidak ditemukan" }, { status: 404 });
    if (promes.userId !== decoded.userId && decoded.isAdmin !== true) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: promes });
  } catch (error) {
    console.error("Get Promes error:", error);
    return NextResponse.json({ error: "Failed to fetch Promes" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const promes = await prismaClient.promes.findUnique({ where: { id } });
    if (!promes) return NextResponse.json({ error: "Promes tidak ditemukan" }, { status: 404 });
    if (promes.userId !== decoded.userId && decoded.isAdmin !== true) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prismaClient.promes.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Promes error:", error);
    return NextResponse.json({ error: "Failed to delete Promes" }, { status: 500 });
  }
}
