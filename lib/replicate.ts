import Replicate from "replicate"
import fetch from "node-fetch" // Only needed for base64 conversion
import { uploadImageToCloudinary } from "@/lib/cloudinary1"

type ReplicateFileOutput = {
  url(): string
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function generateIdeogramV2TurboImage(prompt: string, returnBase64 = true) {
  try {
    console.log("Generating image using ideogram-v2-turbo...")

    const output = (await replicate.run("ideogram-ai/ideogram-v2-turbo", {
      input: { prompt, aspect_ratio: "9:16" },
    })) as ReplicateFileOutput

    const imageUrl = output.url()

    if (!imageUrl) {
      throw new Error("No image returned from Replicate.")
    }

    if (!returnBase64) {
      return imageUrl // return direct image URL
    }

    // Convert to base64 if requested
    const imageResponse = await fetch(imageUrl)
    const buffer = await imageResponse.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")
    return `data:image/png;base64,${base64}`
  } catch (error) {
    console.error("Error generating image with Replicate:", error)
    throw error
  }
}

/**
 * Generate an image using Replicate and return the direct image URL.
 * Throws on error, does not fallback to Unsplash or any other image.
 * @param prompt {string} - The prompt to send to Replicate
 * @returns {Promise<string>} - The direct image URL
 */
export async function generateReplicateImageUrl(prompt: string): Promise<string> {
  try {
    console.log("Generating image using Replicate (URL only)...")
    const output = (await replicate.run("ideogram-ai/ideogram-v2-turbo", {
      input: { prompt, aspect_ratio: "9:16" },
    })) as ReplicateFileOutput
    const imageUrl = output.url()
    if (!imageUrl) {
      throw new Error("No image returned from Replicate.")
    }
    return imageUrl
  } catch (error) {
    console.error("Error generating image with Replicate:", error)
    throw error
  }
}

export async function generateIdeogramV2TurboImageAndUpload(prompt: string): Promise<string | null> {
  try {
    const base64Image = await generateIdeogramV2TurboImage(prompt, true)
    if (!base64Image) {
      console.error("Failed to generate image.")
      return null
    }

    const cloudinaryResult = await uploadImageToCloudinary(base64Image)
    if (!cloudinaryResult) {
      console.error("Failed to upload image to Cloudinary.")
      return null
    }

    return cloudinaryResult.secure_url
  } catch (error: any) {
    console.error("Error in generateIdeogramV2TurboImageAndUpload:", error)
    return null
  }
}
