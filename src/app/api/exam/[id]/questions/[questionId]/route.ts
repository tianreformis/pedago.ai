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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string; questionId: string }> }) {
  try {
    const { userId } = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, questionId } = await params;
    const exam = await prismaClient.exam.findUnique({ where: { id } });
    if (!exam || exam.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { pertanyaan, point, jenis, kunciJawaban, choices } = body;

    if (!pertanyaan || pertanyaan.trim().length === 0) {
      return NextResponse.json({ error: "Pertanyaan tidak boleh kosong" }, { status: 400 });
    }
    if (!point || point < 1) {
      return NextResponse.json({ error: "Point harus minimal 1" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {
      pertanyaan: pertanyaan.trim(),
      point: parseInt(point),
    };
    if (jenis && ["essay", "pilihan_ganda", "multiple_answer"].includes(jenis)) {
      updateData.jenis = jenis;
    }
    if (kunciJawaban) {
      updateData.kunciJawaban = kunciJawaban;
    }

    await prismaClient.examQuestionChoice.deleteMany({ where: { questionId } });

    const question = await prismaClient.examQuestion.update({
      where: { id: questionId },
      data: {
        ...updateData,
        choices: choices && choices.length > 0
          ? { create: choices.map((c: { label: string; teks: string }) => ({ label: c.label, teks: c.teks })) }
          : undefined,
      },
      include: { choices: { orderBy: { label: "asc" } } },
    });

    return NextResponse.json({ success: true, data: question });
  } catch (error) {
    console.error("Update question error:", error);
    return NextResponse.json({ error: "Failed to update question" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string; questionId: string }> }) {
  try {
    const { userId } = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, questionId } = await params;
    const exam = await prismaClient.exam.findUnique({ where: { id } });
    if (!exam || exam.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prismaClient.examQuestion.delete({ where: { id: questionId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete question error:", error);
    return NextResponse.json({ error: "Failed to delete question" }, { status: 500 });
  }
}
