import cloudinary from 'cloudinary';
import { MongoClient } from 'mongodb';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME1!,
  api_key: process.env.CLOUDINARY_API_KEY1!,
  api_secret: process.env.CLOUDINARY_API_SECRET1!,
});

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/empusaaiimproved-fb';

async function deleteExpiredImages() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db();
    const cutoff = new Date(Date.now() - 4 * 60 * 60 * 1000); // 4 hours ago
    const expiredImages = await db.collection('cloudinary_images').find({
      createdAt: { $lt: cutoff },
      deleted: false,
    }).toArray();

    for (const img of expiredImages) {
      try {
        await cloudinary.v2.uploader.destroy(img.public_id);
        await db.collection('cloudinary_images').updateOne(
          { _id: img._id },
          { $set: { deleted: true, deletedAt: new Date() } }
        );
        console.log(`Deleted ${img.public_id}`);
      } catch (err) {
        console.error(`Failed to delete ${img.public_id}:`, err);
      }
    }
  } finally {
    await client.close();
  }
}

deleteExpiredImages();
