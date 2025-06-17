import Replicate from "replicate";
import fetch from "node-fetch"; // Only needed for base64 conversion

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function generateFluxSchnellImage(prompt: string, returnBase64 = true) {
  try {
    console.log("Generating image using flux-schnell...");

    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: { prompt },
      }
    );

    const imageUrl = (output as string[])[0];

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
