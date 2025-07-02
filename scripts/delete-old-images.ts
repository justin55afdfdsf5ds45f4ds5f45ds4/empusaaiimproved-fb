import cloudinary from 'cloudinary';

// ...cloudinary config as above...

async function deleteExpiredImages() {
  // Query your DB for images older than 3 hours, get their public_ids
  // Example: const expiredImages = await getExpiredImagesFromDB();
  // For demo, just an array:
  const expiredImages = [{ public_id: 'pinterest/xyz123' }];

  for (const img of expiredImages) {
    await cloudinary.v2.uploader.destroy(img.public_id);
    // await markImageDeletedInDB(img.public_id);
    console.log(`Deleted ${img.public_id}`);
  }
}

deleteExpiredImages();
