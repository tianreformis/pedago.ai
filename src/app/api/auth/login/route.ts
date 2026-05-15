import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/jwt";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password, turnstileToken } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 });
    }

    if (!turnstileToken || !(await verifyTurnstileToken(turnstileToken))) {
      return NextResponse.json({ error: "Verifikasi captcha gagal" }, { status: 400 });
    }

    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    const token = createToken(user.id, user.email, user.isAdmin);

    const response = NextResponse.json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, name: user.name, school: user.school, isAdmin: user.isAdmin },
        token,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login gagal" }, { status: 500 });
  }
}