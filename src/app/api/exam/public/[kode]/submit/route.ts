import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(req: NextRequest, { params }: { params: Promise<{ kode: string }> }) {
  try {
    const { kode } = await params;
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const studentId = decoded.userId;

    const student = await prismaClient.examStudent.findUnique({
      where: { id: studentId },
      include: { exam: true },
    });

    if (!student || student.exam.kodeUjian !== kode) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (student.submittedAt) {
      return NextResponse.json({ error: "Sudah dikumpulkan" }, { status: 400 });
    }

    await prismaClient.examStudent.update({
      where: { id: studentId },
      data: { submittedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submit exam error:", error);
    return NextResponse.json({ error: "Failed to submit exam" }, { status: 500 });
  }
}
