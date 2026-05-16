import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email harus diisi" }, { status: 400 });
    }

    const student = await prismaClient.student.findUnique({ where: { email } });
    if (!student) {
      return NextResponse.json({ error: "Email tidak terdaftar" }, { status: 404 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prismaClient.student.update({
      where: { id: student.id },
      data: { resetToken: token, resetTokenExpiry: expiresAt },
    });

    return NextResponse.json({
      success: true,
      message: "Token reset password telah dibuat",
      token,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("Student forgot password error:", error);
    return NextResponse.json({ error: "Gagal memproses" }, { status: 500 });
  }
}
