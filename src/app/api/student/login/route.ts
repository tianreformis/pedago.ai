import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password harus diisi" }, { status: 400 });
    }

    const student = await prismaClient.student.findUnique({ where: { email } });
    if (!student) {
      return NextResponse.json({ error: "Email tidak terdaftar" }, { status: 400 });
    }

    const valid = await bcrypt.compare(password, student.password);
    if (!valid) {
      return NextResponse.json({ error: "Password salah" }, { status: 400 });
    }

    const token = createToken(student.id, student.email, false, "student");

    return NextResponse.json({
      success: true,
      token,
      nama: student.nama,
      email: student.email,
    });
  } catch (error) {
    console.error("Student login error:", error);
    return NextResponse.json({ error: "Login gagal" }, { status: 500 });
  }
}
