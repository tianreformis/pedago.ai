import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload?.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const users = await prismaClient.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        school: true,
        isAdmin: true,
        subscriptionStatus: true,
        subscriptionPlan: true,
        subscriptionExpiry: true,
        subscriptionMidtransId: true,
        createdAt: true,
        _count: {
          select: {
            rpps: true,
            protas: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("Get Users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload?.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { userId, action, ...data } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    let updateData: any = {};

    if (action === "setSubscription") {
      if (data.status === "active" && data.plan && data.durationMonths) {
        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + data.durationMonths);
        
        updateData = {
          subscriptionStatus: data.status,
          subscriptionPlan: data.plan,
          subscriptionExpiry: expiry,
        };
      } else if (data.status === "free" || data.status === "expired") {
        updateData = {
          subscriptionStatus: data.status,
          subscriptionPlan: null,
          subscriptionExpiry: null,
        };
      }
    } else if (action === "toggleAdmin") {
      updateData = { isAdmin: data.isAdmin };
    }

    const user = await prismaClient.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("Update User error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}