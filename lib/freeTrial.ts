// Free trial management utilities
import { ObjectId } from 'mongodb';
import clientPromise from './mongodb';

const FREE_TRIAL_LIMIT = 5;
const DB_NAME = process.env.MONGODB_DB || 'empusa';
const USERS_COLLECTION = 'users';

async function getUserById(userId: string | ObjectId) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  return db.collection(USERS_COLLECTION).findOne({ _id: typeof userId === 'string' ? new ObjectId(userId) : userId });
}

async function updateUserById(userId: string | ObjectId, update: any) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  return db.collection(USERS_COLLECTION).updateOne(
    { _id: typeof userId === 'string' ? new ObjectId(userId) : userId },
    { $set: update }
  );
}

export async function isFreeTrialUser(userId: string | ObjectId) {
  const user = await getUserById(userId);
  return user?.isFreeTrial === true;
}

export async function getFreeTrialPostsUsed(userId: string | ObjectId) {
  const user = await getUserById(userId);
  return user?.freeTrialPostsUsed || 0;
}

export async function incrementFreeTrialPosts(userId: string | ObjectId) {
  const user = await getUserById(userId);
  if (!user || !user.isFreeTrial) return;
  const used = user.freeTrialPostsUsed || 0;
  await updateUserById(userId, { freeTrialPostsUsed: used + 1 });
}

export async function hasExhaustedFreeTrial(userId: string | ObjectId) {
  const used = await getFreeTrialPostsUsed(userId);
  return used >= FREE_TRIAL_LIMIT;
}

export function getFreeTrialLimit() {
  return FREE_TRIAL_LIMIT;
}
