export async function generateImage(prompt: string) {
  try {
    console.log(`Generating image with prompt: ${prompt}`)

    const res = await fetch(`https://api.fal.ai/v1/predictions`, {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.FALAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "stable-diffusion-xl-v1-0",
        input: { prompt },
      }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error(`Fal.ai request failed with status ${res.status}:`, errorText)
      throw new Error(`Fal.ai request failed with status ${res.status}`)
    }

    const data = await res.json()
    console.log("Image generated successfully")

    return data.output.url as string
  } catch (error) {
    console.error("Error in generateImage:", error)
    throw error
  }
}
