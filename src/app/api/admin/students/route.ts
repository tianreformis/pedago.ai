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

export async function GET(req: NextRequest) {
  try {
    const { isAdmin } = getUserId(req);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const students = await prismaClient.student.findMany({
      select: {
        id: true,
        email: true,
        nama: true,
        createdAt: true,
        _count: { select: { examStudents: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: students });
  } catch (error) {
    console.error("Admin list students error:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { isAdmin } = getUserId(req);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { email, nama, password } = await req.json();
    if (!email || !nama || !password) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 });
    }

    // Check email uniqueness across Student and User tables
    const existingStudent = await prismaClient.student.findUnique({ where: { email } });
    if (existingStudent) {
      return NextResponse.json({ error: "Email sudah terdaftar sebagai siswa" }, { status: 400 });
    }

    const existingUser = await prismaClient.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar sebagai guru/admin" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await prismaClient.student.create({
      data: { email, nama, password: hashedPassword },
      select: { id: true, email: true, nama: true, createdAt: true },
    });

    return NextResponse.json({ success: true, data: student });
  } catch (error) {
    console.error("Admin create student error:", error);
    return NextResponse.json({ error: "Gagal membuat siswa" }, { status: 500 });
  }
}
