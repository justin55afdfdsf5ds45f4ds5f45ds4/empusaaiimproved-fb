export async function generateImage(prompt: string) {
  try {
    if (!process.env.FALAI_API_KEY) {
      throw new Error("FALAI_API_KEY environment variable is not set")
    }

    const modelId = process.env.FALAI_MODEL_ID || "stable-diffusion-xl-v1-0"

    const res = await fetch(`https://api.fal.ai/v1/predictions`, {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.FALAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelId,
        input: { prompt },
      }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`Fal.ai request failed: ${res.status} ${errorText}`)
    }

    const data = await res.json()
    return data.output.url as string
  } catch (error) {
    console.error("Error generating image with Fal.ai:", error)
    throw error
  }
}
