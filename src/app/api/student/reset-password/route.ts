import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();
    if (!token || !password) {
      return NextResponse.json({ error: "Token dan password harus diisi" }, { status: 400 });
    }

    const student = await prismaClient.student.findUnique({
      where: { resetToken: token },
    });

    if (!student || !student.resetTokenExpiry || student.resetTokenExpiry < new Date()) {
      return NextResponse.json({ error: "Token tidak valid atau sudah kadaluarsa" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prismaClient.student.update({
      where: { id: student.id },
      data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
    });

    return NextResponse.json({ success: true, message: "Password berhasil direset" });
  } catch (error) {
    console.error("Student reset password error:", error);
    return NextResponse.json({ error: "Gagal mereset password" }, { status: 500 });
  }
}
