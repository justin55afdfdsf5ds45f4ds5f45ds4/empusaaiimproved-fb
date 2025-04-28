import mongoose from "mongoose"

// Define the Post schema
const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    sourceUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "scheduled"],
      default: "draft",
    },
    scheduledDate: {
      type: Date,
      default: null,
    },
    pinterestId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

// Create and export the Post model
export const Post = mongoose.models.Post || mongoose.model("Post", postSchema)
