import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

interface DailyLimits {
  postsGenerated: number;
  postsPublished: number;
  postsScheduled: number;
  lastResetDate: Date;
}

const PREMIUM_LIMITS = {
  postsPerDay: 100,
  publishPerDay: 100,
  schedulePerDay: 100,
};

const FREE_LIMITS = {
  postsPerDay: 10,
  publishPerDay: 5,
  schedulePerDay: 5,
};

export async function getDailyLimits(userId: string): Promise<DailyLimits> {
  const client = await clientPromise;
  const db = client.db();

  // Get today's start and end timestamps
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // Get or create daily limits record
  let limits = await db.collection("daily_limits").findOne({
    userId,
    date: { $gte: startOfDay, $lte: endOfDay }
  });

  if (!limits) {
    limits = {
      userId,
      date: new Date(),
      postsGenerated: 0,
      postsPublished: 0,
      postsScheduled: 0,
      lastResetDate: startOfDay
    } as any;
    await db.collection("daily_limits").insertOne(limits as any);
  }

  return limits;
}

export async function incrementDailyLimit(
  userId: string,
  type: "postsGenerated" | "postsPublished" | "postsScheduled",
  count: number = 1
): Promise<{ success: boolean; remaining: number; nextResetTime: Date }> {
  const client = await clientPromise;
  const db = client.db();

  // Get user's premium status
  const user = await db.collection("users").findOne({ id: userId });
  let premiumUntil = user?.premiumUntil as string | null | undefined;

  if (!premiumUntil) {
    // Fallback to Supabase value
    const { data: sbUser } = await supabaseAdmin
      .from("users")
      .select("premiumuntil")
      .eq("id", userId)
      .single();
    premiumUntil = sbUser?.premiumuntil ?? null;
  }

  const isPremium = premiumUntil ? new Date(premiumUntil) > new Date() : false;
  const limits = isPremium ? PREMIUM_LIMITS : FREE_LIMITS;

  // Get today's start and end timestamps
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // Get or create daily limits record
  let dailyLimits: any = await db.collection("daily_limits").findOne({
    userId,
    date: { $gte: startOfDay, $lte: endOfDay }
  });

  if (!dailyLimits) {
    dailyLimits = {
      userId,
      date: new Date(),
      postsGenerated: 0,
      postsPublished: 0,
      postsScheduled: 0,
      lastResetDate: startOfDay
    } as any;
    await db.collection("daily_limits").insertOne(dailyLimits as any);
  }

  // Check if increment would exceed limit
  const currentCount = dailyLimits[type] || 0;
  const limitKey = type === "postsGenerated" ? "postsPerDay" 
                  : type === "postsPublished" ? "publishPerDay"
                  : "schedulePerDay";
  
  if (currentCount + count > limits[limitKey]) {
    // Calculate next reset time
    const nextResetTime = new Date(startOfDay);
    nextResetTime.setDate(nextResetTime.getDate() + 1);

    return {
      success: false,
      remaining: Math.max(0, limits[limitKey] - currentCount),
      nextResetTime
    };
  }

  // Increment the count
  await db.collection("daily_limits").updateOne(
    { userId, date: { $gte: startOfDay, $lte: endOfDay } },
    { $inc: { [type]: count } }
  );

  // If generating posts, also update Supabase users.count_num_posts for reporting
  if (type === "postsGenerated") {
    await supabaseAdmin
      .from("users")
      .update({ count_num_posts: (user?.count_num_posts || 0) + count })
      .eq("id", userId);
  }

  // Calculate remaining
  const remaining = limits[limitKey] - (currentCount + count);
  const nextResetTime = new Date(startOfDay);
  nextResetTime.setDate(nextResetTime.getDate() + 1);

  return {
    success: true,
    remaining,
    nextResetTime
  };
}

export async function getRemainingLimits(userId: string): Promise<{
  postsGenerated: { remaining: number; nextResetTime: Date };
  postsPublished: { remaining: number; nextResetTime: Date };
  postsScheduled: { remaining: number; nextResetTime: Date };
  isPremium: boolean;
}> {
  const client = await clientPromise;
  const db = client.db();

  // Get user's premium status
  const user = await db.collection("users").findOne({ id: userId });
  let premiumUntil = user?.premiumUntil as string | null | undefined;

  if (!premiumUntil) {
    // Fallback to Supabase value
    const { data: sbUser } = await supabaseAdmin
      .from("users")
      .select("premiumuntil")
      .eq("id", userId)
      .single();
    premiumUntil = sbUser?.premiumuntil ?? null;
  }

  const isPremium = premiumUntil ? new Date(premiumUntil) > new Date() : false;
  const limits = isPremium ? PREMIUM_LIMITS : FREE_LIMITS;

  const dailyLimits = await getDailyLimits(userId);
  const nextResetTime = new Date();
  nextResetTime.setDate(nextResetTime.getDate() + 1);
  nextResetTime.setHours(0, 0, 0, 0);

  return {
    postsGenerated: {
      remaining: Math.max(0, limits.postsPerDay - (dailyLimits.postsGenerated || 0)),
      nextResetTime
    },
    postsPublished: {
      remaining: Math.max(0, limits.publishPerDay - (dailyLimits.postsPublished || 0)),
      nextResetTime
    },
    postsScheduled: {
      remaining: Math.max(0, limits.schedulePerDay - (dailyLimits.postsScheduled || 0)),
      nextResetTime
    },
    isPremium
  };
}

export function getTimeUntilReset(nextResetTime: Date): string {
  const now = new Date();
  const diffMs = nextResetTime.getTime() - now.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${diffHrs}h ${diffMins}m`;
} 