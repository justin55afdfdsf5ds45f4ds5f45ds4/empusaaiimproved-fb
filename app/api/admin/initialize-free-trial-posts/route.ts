import { NextResponse } from 'next/server';
import { initializeFreeTrialPostsUsedForAll } from '@/lib/freeTrial';

export async function POST() {
  try {
    await initializeFreeTrialPostsUsedForAll();
    return NextResponse.json({ success: true, message: 'Initialized freeTrialPostsUsed for all free trial users.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
} 