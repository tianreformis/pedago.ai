import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { createPaymentLink } from "@/lib/midtrans";
import { verifyToken } from "@/lib/jwt";
import { PRICING } from "@/lib/pricing";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const plan: string = body.plan;

    if (!plan || !["monthly", "yearly"].includes(plan)) {
      return NextResponse.json({ error: "Pilih paket bulanan atau tahunan" }, { status: 400 });
    }

    const user = await prismaClient.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    if (user.isAdmin) {
      return NextResponse.json({
        success: true,
        data: {
          isAdmin: true,
          message: "Admin memiliki akses tanpa batas",
        },
      });
    }

    const amount = PRICING[plan as keyof typeof PRICING].amount;
    const orderId = `PED-${Date.now().toString(36)}-${crypto.randomBytes(4).toString("hex")}`;

    const midtransResponse = await createPaymentLink({
      orderId,
      amount,
      customerName: user.name || "Customer",
      customerEmail: user.email,
    });

    await prismaClient.user.update({
      where: { id: user.id },
      data: { subscriptionMidtransId: orderId },
    });

    return NextResponse.json({
      success: true,
      data: {
        token: midtransResponse.token,
        redirectUrl: midtransResponse.redirect_url,
        orderId,
      },
    });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json({ error: "Gagal membuat pembayaran" }, { status: 500 });
  }
}