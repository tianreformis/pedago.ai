import { NextRequest, NextResponse } from "next/server";
import { generateRPP } from "@/lib/mistral";
import { prismaClient } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

function getClientIP(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0] || 
         req.headers.get("x-real-ip") || 
         "unknown";
}

const FREE_LIMIT = 1;

async function checkFreeLimit(ip: string): Promise<{ allowed: boolean; remaining: number }> {
  let usage = await prismaClient.freeUsage.findUnique({ where: { ipAddress: ip } });
  
  if (!usage) {
    await prismaClient.freeUsage.create({ data: { ipAddress: ip, count: 1 } });
    return { allowed: true, remaining: 0 };
  }
  
  if (usage.count < FREE_LIMIT) {
    usage = await prismaClient.freeUsage.update({
      where: { ipAddress: ip },
      data: { count: usage.count + 1 },
    });
    return { allowed: true, remaining: FREE_LIMIT - usage.count };
  }
  
  return { allowed: false, remaining: 0 };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mataPelajaran, fase, cp, kelas, namaGuru, sekolah, tahunAjaran, semester, alokasWaktu } = body;

    if (!mataPelajaran || !fase || !cp) {
      return NextResponse.json(
        { error: "Mata pelajaran, fase, dan CP wajib diisi" },
        { status: 400 }
      );
    }

    const authHeader = req.headers.get("authorization");
    let userId: string | null = null;
    let isSubscriber = false;
    let isAdmin = false;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const payload = verifyToken(token);
      if (payload) {
        isAdmin = payload.isAdmin === true;
        if (isAdmin) {
          userId = payload.userId;
        } else {
          const user = await prismaClient.user.findUnique({ where: { id: payload.userId } });
          if (user) {
            userId = payload.userId;
            if (user.subscriptionStatus === "active" && 
                user.subscriptionExpiry && user.subscriptionExpiry > new Date()) {
              isSubscriber = true;
            }
          }
        }
      }
    }

    if (!isAdmin && !isSubscriber && !userId) {
      const clientIP = getClientIP(req);
      const { allowed } = await checkFreeLimit(clientIP);
      
      if (!allowed) {
        return NextResponse.json(
          { 
            error: "Batas penggunaan gratis tercapai. Silakan login atau langganan untuk melanjutkan.",
            requireLogin: true,
            freeLimitReached: true
          },
          { status: 403 }
        );
      }
    }

    const rppOutput = await generateRPP({
      mataPelajaran,
      fase,
      cp: cp || "",
      kelas,
      namaGuru,
      sekolah,
      tahunAjaran,
      semester,
      alokasWaktu,
    });

    if (userId) {
      await prismaClient.rPP.create({
        data: {
          userId,
          mataPelajaran,
          fase,
          cp: cp || null,
          kelas: kelas || null,
          sekolah: sekolah || null,
          namaGuru: namaGuru || null,
          tahunAjaran: tahunAjaran || null,
          semester: semester || null,
          alokasWaktu: alokasWaktu || null,
          rawOutput: rppOutput as any,
        },
      });
    }

    return NextResponse.json({ success: true, data: rppOutput });
  } catch (error) {
    console.error("Generate RPP error:", error);
    return NextResponse.json(
      { error: "Gagal generate RPP. Silakan coba lagi." },
      { status: 500 }
    );
  }
}