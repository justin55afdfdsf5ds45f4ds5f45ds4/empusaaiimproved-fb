import Replicate from "replicate";
import fetch from "node-fetch"; // Only needed for base64 conversion

type ReplicateFileOutput = {
  url(): string;
};

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function generateIdeogramV2TurboImage(
  prompt: string,
  returnBase64 = true
) {
  try {
    console.log("Generating image using ideogram-v2-turbo...");

    const output = (await replicate.run("ideogram-ai/ideogram-v2-turbo", {
      input: { prompt, aspect_ratio: "9:16" },
    })) as ReplicateFileOutput;

    const imageUrl = output.url();

    if (!imageUrl) {
      throw new Error("No image returned from Replicate.");
    }

    if (!returnBase64) {
      return imageUrl; // return direct image URL
    }

    // Convert to base64 if requested
    const imageResponse = await fetch(imageUrl);
    const buffer = await imageResponse.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    console.error("Error generating image with Replicate:", error);
    throw error;
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
    console.log("Generating image using Replicate (URL only)...");
    const output = (await replicate.run("ideogram-ai/ideogram-v2-turbo", {
      input: { prompt, aspect_ratio: "9:16" },
    })) as ReplicateFileOutput;
    const imageUrl = output.url();
    if (!imageUrl) {
      throw new Error("No image returned from Replicate.");
    }
    return imageUrl;
  } catch (error) {
    console.error("Error generating image with Replicate:", error);
    throw error;
  }
}
