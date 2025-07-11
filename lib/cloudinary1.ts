import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImageBase64(base64String: string, folder = 'pinterest') {
  const res = await cloudinary.v2.uploader.upload(base64String, {
    folder,
    resource_type: 'image',
    format: 'jpg', // Always upload as JPEG
  });
  // Ensure the URL ends with .jpg (Cloudinary will provide the correct format)
  let url = res.secure_url;
  if (!url.endsWith('.jpg')) {
    url = url.replace(/\.(png|webp|jpeg|gif|bmp|tiff|ico)(\?.*)?$/, '.jpg$2');
  }
  return {
    url,
    public_id: res.public_id,
  };
}

// Delete an image by public_id
export async function deleteImage(public_id: string) {
  return cloudinary.v2.uploader.destroy(public_id, { resource_type: 'image' });
}
