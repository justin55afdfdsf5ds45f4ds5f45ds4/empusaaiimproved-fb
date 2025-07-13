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
  // Convert width/height to aspect ratio string
  let aspectRatio = "9:16"; // default
  if (width && height) {
    if (width === height) aspectRatio = "1:1";
    else if (width > height) aspectRatio = "16:9";
    else if (width/height === 9/16) aspectRatio = "9:16";
    else if (width/height === 2/3) aspectRatio = "2:3";
  }
  
  console.log('\n=== Ideogram Image Generation Parameters ===');
  console.log('Requested dimensions:', { width, height });
  console.log('Using aspect ratio:', aspectRatio);
  console.log('Prompt:', prompt);

  // Add aspect ratio to the prompt
  const aspectRatioPrompt = `${prompt} This must be a ${aspectRatio} aspect ratio image, designed specifically for ${aspectRatio === "9:16" ? "vertical" : aspectRatio === "16:9" ? "landscape" : "square"} format.`;
  
  const modelParams = {
    input: {
      prompt: aspectRatioPrompt,
      aspect_ratio: aspectRatio,
      guidance_scale: 7.5,
      negative_prompt: "blurry, low quality, cropped, squished, stretched, distorted, wrong aspect ratio, wrong format",
      num_inference_steps: 50,
    },
  };

  console.log('Model parameters:', JSON.stringify(modelParams, null, 2));
  
  const output = await replicate.run(
    "ideogram-ai/ideogram-v2-turbo",
    modelParams
  );

  // Log the output structure
  console.log('Raw model output:', output);
  
  if (Array.isArray(output)) {
    console.log('Number of images returned:', output.length);
    if (output.length > 0) {
      console.log('First image URL:', output[0]);
    }
  } else {
    console.log('Single output URL:', output);
  }
  console.log('=======================================\n');

  if (returnArray) return output as string[];
  return Array.isArray(output) ? output[0] : String(output);
}
