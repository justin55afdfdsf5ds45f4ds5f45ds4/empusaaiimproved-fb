import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME1!,
  api_key: process.env.CLOUDINARY_API_KEY1!,
  api_secret: process.env.CLOUDINARY_API_SECRET1!,
});

export async function uploadImageBase64(base64: string, folder = 'pinterest', format?: string) {
  const uploadOptions: any = {
    folder,
    resource_type: 'image',
  };
  if (format) {
    uploadOptions.format = format;
  }
  const res = await cloudinary.v2.uploader.upload(base64, uploadOptions);
  return {
    url: res.secure_url,
    public_id: res.public_id,
  };
}