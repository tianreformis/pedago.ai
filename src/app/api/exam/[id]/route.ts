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
    const { userId } = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const exam = await prismaClient.exam.findUnique({
      where: { id },
      include: {
        questions: {
          include: { choices: { orderBy: { label: "asc" } } },
          orderBy: { createdAt: "asc" },
        },
        _count: { select: { students: true } },
      },
    });

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }
    if (exam.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: exam });
  } catch (error) {
    console.error("Get exam error:", error);
    return NextResponse.json({ error: "Failed to fetch exam" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prismaClient.exam.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }
    if (existing.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { mataPelajaran, jenjang, kelas, judul, tanggalMulai, tanggalSelesai } = body;

    const updateData: Record<string, unknown> = {};
    if (mataPelajaran) updateData.mataPelajaran = mataPelajaran;
    if (jenjang !== undefined) updateData.jenjang = jenjang || null;
    if (kelas !== undefined) updateData.kelas = kelas || null;
    if (judul) updateData.judul = judul;
    if (tanggalMulai) updateData.tanggalMulai = new Date(tanggalMulai);
    if (tanggalSelesai) updateData.tanggalSelesai = new Date(tanggalSelesai);

    if (updateData.tanggalSelesai && updateData.tanggalMulai && updateData.tanggalSelesai <= updateData.tanggalMulai) {
      return NextResponse.json({ error: "Tanggal selesai harus setelah tanggal mulai" }, { status: 400 });
    }

    const exam = await prismaClient.exam.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: exam });
  } catch (error) {
    console.error("Update exam error:", error);
    return NextResponse.json({ error: "Failed to update exam" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prismaClient.exam.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }
    if (existing.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prismaClient.exam.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete exam error:", error);
    return NextResponse.json({ error: "Failed to delete exam" }, { status: 500 });
  }
}
