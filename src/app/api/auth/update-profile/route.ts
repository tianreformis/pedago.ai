import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { name, school } = body;

    const updatedUser = await prismaClient.user.update({
      where: { id: decoded.userId },
      data: {
        ...(name !== undefined && { name }),
        ...(school !== undefined && { school }),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        school: updatedUser.school,
        isAdmin: updatedUser.isAdmin,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Gagal memperbarui profil" }, { status: 500 });
  }
}
