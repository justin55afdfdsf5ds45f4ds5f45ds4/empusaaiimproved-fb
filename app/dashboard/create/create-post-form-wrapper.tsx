"use client"

import { useSearchParams } from "next/navigation"
import { CreatePostForm } from "./create-post-form"

export function CreatePostFormWrapper() {
  const searchParams = useSearchParams()
  const urlParam = searchParams.get("url")

  return <CreatePostForm initialUrl={urlParam || ""} />
}
