"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { CreatePostForm } from "./create-post-form"

export default function CreatePostFormWrapper() {
  return (
    <Suspense fallback={<Loading />}>
      <CreatePostFormContent />
    </Suspense>
  )
}

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-gray-500">Loading post form...</p>
    </div>
  )
}

function CreatePostFormContent() {
  const searchParams = useSearchParams()
  const url = searchParams.get("url") || ""

  return <CreatePostForm initialUrl={url} />
}
