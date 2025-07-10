// Free trial management utilities
import { ObjectId } from 'mongodb';
import clientPromise from './mongodb';

const FREE_TRIAL_LIMIT = 1;
const DB_NAME = process.env.MONGODB_DB || 'empusa';
const USERS_COLLECTION = 'users';

async function getUserById(userId: string | ObjectId) {
  console.log("[freeTrial] getUserById called", { userId });
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const user = await db.collection(USERS_COLLECTION).findOne({ _id: typeof userId === 'string' ? new ObjectId(userId) : userId });
  console.log("[freeTrial] getUserById result", { user });
  return user;
}

async function updateUserById(userId: string | ObjectId, update: any) {
  console.log("[freeTrial] updateUserById called", { userId, update });
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const result = await db.collection(USERS_COLLECTION).updateOne(
    { _id: typeof userId === 'string' ? new ObjectId(userId) : userId },
    { $set: update }
  );
  console.log("[freeTrial] updateUserById result", { result });
  return result;
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
  console.log("[freeTrial] incrementFreeTrialPosts called", { userId });
  const user = await getUserById(userId);
  if (!user || !user.isFreeTrial) {
    console.log("[freeTrial] incrementFreeTrialPosts: not a free trial user", { user });
    return;
  }
  const used = user.freeTrialPostsUsed || 0;
  const result = await updateUserById(userId, { freeTrialPostsUsed: used + 1 });
  console.log("[freeTrial] incrementFreeTrialPosts: updated", { result });
}

export async function incrementFreeTrialPostsAtomic(userId: string | ObjectId, count: number): Promise<boolean> {
  console.log("[freeTrial] incrementFreeTrialPostsAtomic called", { userId, count });
  if (count !== 1) {
    console.log("[freeTrial] incrementFreeTrialPostsAtomic: count !== 1", { count });
    return false;
  }
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const userObjectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
  // Ensure freeTrialPostsUsed is initialized to 0 if missing
  const initResult = await db.collection(USERS_COLLECTION).updateOne(
    { _id: userObjectId, isFreeTrial: true, freeTrialPostsUsed: { $exists: false } },
    { $set: { freeTrialPostsUsed: 0 } }
  );
  console.log("[freeTrial] incrementFreeTrialPostsAtomic: initResult", { initResult });
  // Atomically increment if under the limit
  const result = await db.collection(USERS_COLLECTION).updateOne(
    { _id: userObjectId, isFreeTrial: true, freeTrialPostsUsed: { $lt: FREE_TRIAL_LIMIT } },
    { $inc: { freeTrialPostsUsed: count } }
  );
  console.log("[freeTrial] incrementFreeTrialPostsAtomic: increment result", { result });
  return result.modifiedCount === 1;
}

export async function hasExhaustedFreeTrial(userId: string | ObjectId) {
  const used = await getFreeTrialPostsUsed(userId);
  return used >= FREE_TRIAL_LIMIT;
}

export async function initializeFreeTrialPostsUsedForAll() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  await db.collection(USERS_COLLECTION).updateMany(
    { isFreeTrial: true, freeTrialPostsUsed: { $exists: false } },
    { $set: { freeTrialPostsUsed: 0 } }
  );
}

export function getFreeTrialLimit() {
  return FREE_TRIAL_LIMIT;
}
