import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

function getUserId(req: NextRequest): { userId: string | null; isAdmin: boolean } {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return { userId: null, isAdmin: false };
  const decoded = verifyToken(token);
  return { userId: decoded?.userId || null, isAdmin: decoded?.isAdmin === true };
}

function generateKodeUjian(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function GET(req: NextRequest) {
  try {
    const { userId, isAdmin } = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const exams = await prismaClient.exam.findMany({
      where: isAdmin ? {} : { userId },
      include: { _count: { select: { questions: true, students: true } } },
      orderBy: { createdAt: "desc" },
    });

    // Attach user info for admin view
    if (isAdmin) {
      const userIds = [...new Set(exams.map((e) => e.userId))];
      const users = await prismaClient.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true, email: true },
      });
      const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
      const enriched = exams.map((e) => ({
        ...e,
        user: userMap[e.userId] || null,
      }));
      enriched.sort((a, b) => {
        const aName = (a.user?.name || a.user?.email || "").toLowerCase();
        const bName = (b.user?.name || b.user?.email || "").toLowerCase();
        return aName.localeCompare(bName) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      return NextResponse.json({ success: true, data: enriched });
    }

    return NextResponse.json({ success: true, data: exams });
  } catch (error) {
    console.error("Get exams error:", error);
    return NextResponse.json({ error: "Failed to fetch exams" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, isAdmin } = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check subscription limit for non-admin, non-paid users
    if (!isAdmin) {
      const user = await prismaClient.user.findUnique({
        where: { id: userId },
        select: { subscriptionStatus: true },
      });

      const isPaid = user?.subscriptionStatus === "active";

      if (!isPaid) {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayCount = await prismaClient.exam.count({
          where: {
            userId,
            createdAt: { gte: todayStart },
          },
        });

        if (todayCount >= 1) {
          return NextResponse.json({
            error: "Pengguna free hanya bisa membuat 1 ujian per hari. Upgrade untuk unlimited.",
          }, { status: 403 });
        }
      }
    }

    const body = await req.json();
    const { mataPelajaran, jenjang, kelas, judul, tanggalMulai, tanggalSelesai } = body;

    if (!mataPelajaran || !judul || !tanggalMulai || !tanggalSelesai) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 });
    }

    const mulai = new Date(tanggalMulai);
    const selesai = new Date(tanggalSelesai);
    if (selesai <= mulai) {
      return NextResponse.json({ error: "Tanggal selesai harus setelah tanggal mulai" }, { status: 400 });
    }

    let kodeUjian = generateKodeUjian();
    let existing = await prismaClient.exam.findUnique({ where: { kodeUjian } });
    while (existing) {
      kodeUjian = generateKodeUjian();
      existing = await prismaClient.exam.findUnique({ where: { kodeUjian } });
    }

    const exam = await prismaClient.exam.create({
      data: { userId, mataPelajaran, jenjang: jenjang || null, kelas: kelas || null, judul, kodeUjian, tanggalMulai: mulai, tanggalSelesai: selesai },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...exam,
        _count: { questions: 0, students: 0 },
      },
    });
  } catch (error) {
    console.error("Create exam error:", error);
    return NextResponse.json({ error: "Failed to create exam" }, { status: 500 });
  }
}
