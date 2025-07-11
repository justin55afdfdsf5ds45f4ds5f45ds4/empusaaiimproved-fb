import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN as string,
});

export async function generateText(prompt: string): Promise<string> {
  // Use openai/gpt-4o-mini for text generation
  const output = await replicate.run(
    "openai/gpt-4o-mini",
    {
      input: {
        prompt,
        max_tokens: 120,
        temperature: 0.7,
      },
    }
  );
  // Replicate returns an array of strings
  return Array.isArray(output) ? output.join("") : String(output);
}

export async function generateImage(prompt: string): Promise<string> {
  // Use ideogram-ai/ideogram-v2-turbo for image generation
  const output = await replicate.run(
    "ideogram-ai/ideogram-v2-turbo",
    {
      input: {
        prompt,
        width: 1024,
        height: 1536,
      },
    }
  );
  // Replicate returns an array of image URLs
  return Array.isArray(output) ? output[0] : String(output);
}

export async function generateIdeogramV2TurboImage(prompt: string, returnArray = false, width?: number, height?: number): Promise<string | string[]> {
  // Always use 9:16 (900x1600)
  const output = await replicate.run(
    "ideogram-ai/ideogram-v2-turbo",
    {
      input: {
        prompt,
        width: 900,
        height: 1600,
      },
    }
  );
  if (returnArray) return output as string[];
  return Array.isArray(output) ? output[0] : String(output);
} 