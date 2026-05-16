import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/jwt";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, school, role, turnstileToken } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Nama, email, dan password wajib diisi" }, { status: 400 });
    }

    if (!turnstileToken || !(await verifyTurnstileToken(turnstileToken))) {
      return NextResponse.json({ error: "Verifikasi captcha gagal" }, { status: 400 });
    }

    const existing = await prismaClient.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prismaClient.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        school: school || null,
        role: role || "teacher",
      },
    });

    // If student, also create Student record for exam system compatibility
    if (role === "student") {
      await prismaClient.student.upsert({
        where: { email },
        update: {},
        create: { email, nama: name, password: hashedPassword },
      });
    }

    const token = createToken(user.id, user.email, user.isAdmin, user.role);

    const response = NextResponse.json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, name: user.name, school: user.school, isAdmin: user.isAdmin, role: user.role },
        token,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Registrasi gagal" }, { status: 500 });
  }
}