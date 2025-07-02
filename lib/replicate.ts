import Replicate from "replicate";
import fetch from "node-fetch";

type ReplicateFileOutput = {
  url(): string;
};

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function generateIdeogramV2TurboImageAndUpload(prompt: string) {
  try {
    // 1. Generate the image
    const output = (await replicate.run("ideogram-ai/ideogram-v2-turbo", {
      input: { prompt, aspect_ratio: "9:16" },
    })) as ReplicateFileOutput;

    const imageUrl = output.url();
    if (!imageUrl) throw new Error("No image returned from Replicate.");

    // 2. Get base64 data
    const imageResponse = await fetch(imageUrl);
    const buffer = await imageResponse.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const dataUrl = `data:image/png;base64,${base64}`;

    // 3. Upload to Cloudinary
    const cloudinaryRes = await fetch(
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_ENDPOINT || '/api/upload-image',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64: dataUrl }),
      }
    );
    const { url } = await cloudinaryRes.json();
    if (!url) throw new Error("Cloudinary upload failed");

    // 4. Return Cloudinary URL
    return url;
  } catch (error) {
    console.error("Error generating/uploading image:", error);
    throw error;
  }
}
