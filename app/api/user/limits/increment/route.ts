import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { incrementDailyLimit } from "@/lib/daily-limits";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, count } = await request.json();
    
    if (!type || !["postsGenerated", "postsPublished", "postsScheduled"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid limit type" },
        { status: 400 }
      );
    }

    const result = await incrementDailyLimit(
      session.user.id,
      type as "postsGenerated" | "postsPublished" | "postsScheduled",
      count || 1
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error incrementing limits:", error);
    return NextResponse.json(
      { error: "Failed to increment limits" },
      { status: 500 }
    );
  }
}
