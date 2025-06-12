import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  });

export async function generateImage(prompt: string) {
    console.log("In gpt 40")
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set in environment variables");
    }

    console.log("Calling OpenAI DALL·E with prompt:", prompt.substring(0, 50) + "...");

    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: prompt,
      n: 1,
      size: "1024x1024", // square_hd equivalent
      output_format: "png", // or "b64_json" if you want base64 image
    });

    const dataUrl = response.data?.[0]?.b64_json;
    const imageUrl = `data:image/png;base64,${dataUrl}`;

    if (!imageUrl) {
      throw new Error("No image URL in OpenAI response");
    }

    return imageUrl;
  } catch (error) {
    console.error("Error generating image with OpenAI:", error);
    throw error;
  }
}
