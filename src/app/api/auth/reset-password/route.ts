import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json({ error: "Token dan password harus diisi" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 });
    }

    const resetToken = await prismaClient.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json({ error: "Token tidak valid" }, { status: 400 });
    }

    if (resetToken.used) {
      return NextResponse.json({ error: "Token sudah digunakan" }, { status: 400 });
    }

    if (new Date() > resetToken.expiresAt) {
      return NextResponse.json({ error: "Token sudah kadaluarsa" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prismaClient.user.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword },
    });

    await prismaClient.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Gagal mereset password" }, { status: 500 });
  }
}
