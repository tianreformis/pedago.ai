import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email harus diisi" }, { status: 400 });
    }

    const user = await prismaClient.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Email tidak terdaftar" }, { status: 404 });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayCount = await prismaClient.passwordResetToken.count({
      where: { email, createdAt: { gte: todayStart } },
    });

    if (todayCount >= 3) {
      return NextResponse.json({
        error: "Anda sudah 3 kali request reset hari ini. Coba lagi besok.",
      }, { status: 429 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000);

    await prismaClient.passwordResetToken.create({
      data: { email, token, expiresAt },
    });

    return NextResponse.json({ success: true, token });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Gagal memproses request" }, { status: 500 });
  }
}
