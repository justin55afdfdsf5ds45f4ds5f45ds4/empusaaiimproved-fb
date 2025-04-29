export async function generateImage(prompt: string) {
  const res = await fetch(`https://api.fal.ai/v1/predictions`, {
    method: "POST",
    headers: {
      Authorization: `Key ${process.env.FAL_AI}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "fast-sdxl", // Default model if FALAI_MODEL_ID is not set
      input: { prompt },
    }),
  })

  if (!res.ok) {
    const errorData = await res.text()
    console.error("Fal.ai request failed:", errorData)
    throw new Error(`Fal.ai request failed: ${res.status}`)
  }

  const data = await res.json()
  return data.output.url as string
}
