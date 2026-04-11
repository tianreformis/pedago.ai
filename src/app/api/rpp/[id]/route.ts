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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const rpp = await prismaClient.rPP.findUnique({
      where: { id },
    });

    if (!rpp) {
      return NextResponse.json({ error: "RPP tidak ditemukan" }, { status: 404 });
    }

    if (rpp.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: rpp });
  } catch (error) {
    console.error("Get RPP error:", error);
    return NextResponse.json({ error: "Gagal mengambil RPP" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const rpp = await prismaClient.rPP.findUnique({ where: { id } });

    if (!rpp) {
      return NextResponse.json({ error: "RPP tidak ditemukan" }, { status: 404 });
    }

    if (rpp.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prismaClient.rPP.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete RPP error:", error);
    return NextResponse.json({ error: "Gagal menghapus RPP" }, { status: 500 });
  }
}