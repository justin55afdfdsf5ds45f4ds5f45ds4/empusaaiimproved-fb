import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { isFreeTrialUser, getFreeTrialPostsUsed, getFreeTrialLimit } from '@/lib/freeTrial';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;
  if (!(await isFreeTrialUser(userId))) {
    return NextResponse.json({ remaining: null, limit: null });
  }
  const used = await getFreeTrialPostsUsed(userId);
  const limit = getFreeTrialLimit();
  return NextResponse.json({ remaining: Math.max(0, limit - used), limit });
} 