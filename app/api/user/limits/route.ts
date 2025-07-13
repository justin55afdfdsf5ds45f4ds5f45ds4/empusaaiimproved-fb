import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getRemainingLimits } from "@/lib/daily-limits";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limits = await getRemainingLimits(session.user.id);
    return NextResponse.json(limits);
  } catch (error) {
    console.error("Error getting limits:", error);
    return NextResponse.json(
      { error: "Failed to get limits" },
      { status: 500 }
    );
  }
} 