import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";

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

export async function POST(req: NextRequest) {
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
    const { email, password, name, school } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 });
    }

    const existingUser = await prismaClient.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email sudah digunakan" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prismaClient.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        school: school || null,
      },
    });

    return NextResponse.json({ 
      success: true, 
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        school: user.school,
        isAdmin: user.isAdmin,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionExpiry: user.subscriptionExpiry,
        createdAt: user.createdAt,
        _count: { rpps: 0, protas: 0 },
      }
    });
  } catch (error) {
    console.error("Create User error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
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
    } else if (action === "updateInfo") {
      if (data.name !== undefined) updateData.name = data.name;
      if (data.school !== undefined) updateData.school = data.school;
      if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10);
      }
    }

    const user = await prismaClient.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({ 
      success: true, 
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        school: user.school,
        isAdmin: user.isAdmin,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionExpiry: user.subscriptionExpiry,
      }
    });
  } catch (error) {
    console.error("Update User error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload?.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    if (userId === payload.userId) {
      return NextResponse.json({ error: "Tidak dapat menghapus akun sendiri" }, { status: 400 });
    }

    await prismaClient.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete User error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}