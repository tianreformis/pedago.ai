import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { verifyPaymentNotification, isPaymentSuccessful } from "@/lib/midtrans";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order_id, status_code, gross_amount, signature_key, transaction_status } = body;

    if (!order_id) {
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
    }

    const userIdMatch = order_id.match(/^RPP-([a-zA-Z0-9]+)-/);
    if (!userIdMatch) {
      return NextResponse.json({ error: "Invalid order_id format" }, { status: 400 });
    }

    const userId = userIdMatch[1];

    const isValid = verifyPaymentNotification(
      order_id,
      status_code?.toString() || "0",
      gross_amount?.toString() || "0",
      signature_key
    );

    if (!isValid) {
      console.error("Invalid signature for order:", order_id);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (isPaymentSuccessful(transaction_status)) {
      const user = await prismaClient.user.findUnique({ where: { id: userId } });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const amount = parseInt(gross_amount, 10);
      const isYearly = amount >= 100000;
      const expiryDate = new Date();
      if (isYearly) {
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      } else {
        expiryDate.setMonth(expiryDate.getMonth() + 1);
      }

      await prismaClient.user.update({
        where: { id: userId },
        data: {
          subscriptionStatus: "active",
          subscriptionPlan: isYearly ? "yearly" : "monthly",
          subscriptionExpiry: expiryDate,
        },
      });

      console.log(`Subscription activated for user ${userId}: ${isYearly ? "yearly" : "monthly"}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}