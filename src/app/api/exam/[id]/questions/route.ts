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

async function verifyExamOwner(examId: string, userId: string): Promise<boolean> {
  const exam = await prismaClient.exam.findUnique({ where: { id: examId } });
  if (!exam) return false;
  return exam.userId === userId;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const isOwner = await verifyExamOwner(id, userId);
    if (!isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const questions = await prismaClient.examQuestion.findMany({
      where: { examId: id },
      include: { choices: { orderBy: { label: "asc" } } },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ success: true, data: questions });
  } catch (error) {
    console.error("Get questions error:", error);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const isOwner = await verifyExamOwner(id, userId);
    if (!isOwner) {
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
    if (!jenis || !["essay", "pilihan_ganda", "multiple_answer"].includes(jenis)) {
      return NextResponse.json({ error: "Jenis soal tidak valid" }, { status: 400 });
    }
    if (!kunciJawaban) {
      return NextResponse.json({ error: "Kunci jawaban harus ditentukan" }, { status: 400 });
    }

    const question = await prismaClient.examQuestion.create({
      data: {
        examId: id,
        pertanyaan: pertanyaan.trim(),
        point: parseInt(point),
        jenis,
        kunciJawaban,
        choices: choices && choices.length > 0
          ? { create: choices.map((c: { label: string; teks: string }) => ({ label: c.label, teks: c.teks })) }
          : undefined,
      },
      include: { choices: { orderBy: { label: "asc" } } },
    });

    return NextResponse.json({ success: true, data: question });
  } catch (error) {
    console.error("Create question error:", error);
    return NextResponse.json({ error: "Failed to create question" }, { status: 500 });
  }
}
