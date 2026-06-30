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

    const assets = await prisma.asset.findMany({
      where: {
        organizationId: payload.organizationId,
      },
      orderBy: {
        symbol: "asc",
      },
    });

    const formattedAssets = assets.map((asset) => ({
      ...asset,
      sparkline: JSON.parse(asset.sparkline),
    }));

    return NextResponse.json(formattedAssets);
  } catch (error: any) {
    console.error("Fetch assets API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
