"use client"

import { CreatePostContent } from "./create-post-content"

export default function CreatePage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Create Pinterest Post</h1>
      <CreatePostContent />
    </div>
  )
}
