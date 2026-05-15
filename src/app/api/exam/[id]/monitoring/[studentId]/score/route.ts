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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string; studentId: string }> }) {
  try {
    const { userId } = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, studentId } = await params;
    const exam = await prismaClient.exam.findUnique({ where: { id } });
    if (!exam || exam.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { score } = body;

    if (score === undefined || score === null || score < 0) {
      return NextResponse.json({ error: "Score tidak valid" }, { status: 400 });
    }

    await prismaClient.examStudent.update({
      where: { id: studentId },
      data: { score: parseInt(score) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save score error:", error);
    return NextResponse.json({ error: "Failed to save score" }, { status: 500 });
  }
}
