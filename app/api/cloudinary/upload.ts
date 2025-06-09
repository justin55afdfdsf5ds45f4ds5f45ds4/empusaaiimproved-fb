const cloudinary = require('cloudinary').v2;

// Configure your Cloudinary credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

export async function uploadToCloudinary(base64String:string):Promise<string> {
  try {

    console.log(process.env.CLOUDINARY_CLOUD_NAME)
    console.log(process.env.CLOUDINARY_API_KEY)
    console.log(process.env.CLOUDINARY_API_SECRET)

    
      
    const result = await cloudinary.uploader.upload(base64String, {
      folder: 'fal_images', // Optional: folder in your Cloudinary media library
    });

    console.log('Uploaded image URL:', result.secure_url);
    return result.secure_url;
  } catch (err) {
    console.error('Cloudinary upload failed:', err);
    throw err;
  }
}
