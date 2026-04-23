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

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId, isAdmin } = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const prota = await prismaClient.prota.findUnique({
      where: { id },
    });

    if (!prota) {
      return NextResponse.json({ error: "Prota not found" }, { status: 404 });
    }

    if (!isAdmin && prota.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: prota });
  } catch (error) {
    console.error("Get Prota error:", error);
    return NextResponse.json({ error: "Failed to fetch Prota" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId, isAdmin } = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const prota = await prismaClient.prota.findUnique({
      where: { id },
    });

    if (!prota) {
      return NextResponse.json({ error: "Prota not found" }, { status: 404 });
    }

    if (!isAdmin && prota.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prismaClient.prota.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Prota deleted" });
  } catch (error) {
    console.error("Delete Prota error:", error);
    return NextResponse.json({ error: "Failed to delete Prota" }, { status: 500 });
  }
}