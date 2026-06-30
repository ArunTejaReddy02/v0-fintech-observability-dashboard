import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyJWT } from "@/services/auth/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const alerts = await prisma.alert.findMany({
      where: {
        organizationId: payload.organizationId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(alerts);
  } catch (error: any) {
    console.error("Fetch alerts API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status, resolvedAt } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "Alert ID and status are required." },
        { status: 400 }
      );
    }

    const alert = await prisma.alert.findFirst({
      where: {
        id,
        organizationId: payload.organizationId,
      },
    });

    if (!alert) {
      return NextResponse.json(
        { error: "Alert not found or unauthorized." },
        { status: 404 }
      );
    }

    const updatedAlert = await prisma.alert.update({
      where: { id },
      data: {
        status,
        resolvedAt: resolvedAt ? new Date(resolvedAt) : null,
      },
    });

    return NextResponse.json({ success: true, alert: updatedAlert });
  } catch (error: any) {
    console.error("Update alert API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
