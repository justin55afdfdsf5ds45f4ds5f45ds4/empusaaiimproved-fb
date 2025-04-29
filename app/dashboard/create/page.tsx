"use client" // Added use client directive

import { Suspense } from "react"
import { CreatePostForm } from "./create-post-form"
import { Spinner } from "@/components/ui/spinner"

export default function CreatePage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Create Pinterest Post</h1>
      <Suspense fallback={<Spinner />}>
        <CreatePostForm />
      </Suspense>
    </div>
  )
}
