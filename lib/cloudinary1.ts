import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME1!,
  api_key: process.env.CLOUDINARY_API_KEY1!,
  api_secret: process.env.CLOUDINARY_API_SECRET1!,
});

export async function uploadImageBase64(base64: string, folder = 'pinterest') {
  const res = await cloudinary.v2.uploader.upload(base64, {
    folder,
    resource_type: 'image',
  });
  return {
    url: res.secure_url,
    public_id: res.public_id,
  };
}
