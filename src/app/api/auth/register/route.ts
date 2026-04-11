import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, school } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Nama, email, dan password wajib diisi" }, { status: 400 });
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
      },
    });

    return NextResponse.json({ success: true, message: "Registrasi berhasil. Silakan login." });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Registrasi gagal" }, { status: 500 });
  }
}