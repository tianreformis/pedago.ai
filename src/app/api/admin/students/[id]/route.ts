import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";

function getUserId(req: NextRequest): { userId: string | null; isAdmin: boolean } {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return { userId: null, isAdmin: false };
  const decoded = verifyToken(token);
  return { userId: decoded?.userId || null, isAdmin: decoded?.isAdmin === true };
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { isAdmin } = getUserId(req);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const { email, nama, password } = await req.json();

    const updateData: Record<string, unknown> = {};
    if (email) {
      const existing = await prismaClient.student.findFirst({
        where: { email, id: { not: id } },
      });
      if (existing) {
        return NextResponse.json({ error: "Email sudah digunakan" }, { status: 400 });
      }
      updateData.email = email;
    }
    if (nama) updateData.nama = nama;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const student = await prismaClient.student.update({
      where: { id },
      data: updateData,
      select: { id: true, email: true, nama: true, createdAt: true },
    });

    return NextResponse.json({ success: true, data: student });
  } catch (error) {
    console.error("Admin update student error:", error);
    return NextResponse.json({ error: "Gagal mengupdate siswa" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { isAdmin } = getUserId(req);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    await prismaClient.student.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete student error:", error);
    return NextResponse.json({ error: "Gagal menghapus siswa" }, { status: 500 });
  }
}
