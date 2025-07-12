import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Eye,
  Heart,
  Share2,
  Calendar,
  PinIcon,
  LinkIcon,
  Loader2,
  Trash2,
} from "lucide-react"

interface PostCardProps {
  post: {
    id: string
    title: string
    description: string
    imageUrl: string | null
    defaultLink?: string
    status?: "draft" | "scheduled" | "published"
    scheduledFor?: string
    publishedAt?: string
    createdAt?: string
    metrics?: {
      views: number
      likes: number
      shares: number
    }
  }
  boardName?: string
  customLink?: string
  isSelected?: boolean
  isPublishing?: boolean
  isGeneratingImage?: boolean
  showCheckbox?: boolean
  showActions?: boolean
  onSelect?: (id: string) => void
  onPublish?: (id: string) => void
  onSchedule?: (id: string) => void
  onGenerateImage?: (id: string) => void
  onEditLink?: (id: string) => void
  onDelete?: (id: string) => void
  className?: string
}

function ExpandableDescription({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  const maxChars = 3 * 40; // Approximate 3 lines at 40 chars per line
  const shouldTruncate = description.length > maxChars;
  const displayText = !expanded && shouldTruncate ? description.slice(0, maxChars) : description;
  
  return (
    <div className="mb-4">
      <p className="text-sm text-gray-500 inline" style={{ color: '#6B7280' }}>
        {displayText}
        {shouldTruncate && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-gray-400 hover:text-gray-500 ml-1 inline-block"
          >
            {expanded ? "Show less" : "... Show more"}
          </button>
        )}
      </p>
    </div>
  );
}

function truncateToThreeLines(text: string): { truncated: string; isTruncated: boolean } {
  const avgCharsPerLine = 60; // Approximate characters per line
  const threeLineLimit = avgCharsPerLine * 3;
  
  if (text.length <= threeLineLimit) {
    return { truncated: text, isTruncated: false };
  }

  // Find the last space before the limit
  const lastSpace = text.substring(0, threeLineLimit).lastIndexOf(' ');
  const truncated = text.substring(0, lastSpace);
  
  return { truncated, isTruncated: true };
}

// Utility to truncate text to roughly three lines (approx 240 chars)
function getTruncated(text: string, limit = 240) {
  if (text.length <= limit) return { truncated: text, isTruncated: false }
  // truncate at last space within limit
  const cutoff = text.lastIndexOf(' ', limit)
  const snippet = text.slice(0, cutoff > 0 ? cutoff : limit).trim()
  return { truncated: snippet + '...', isTruncated: true }
}

export function PostCard({
  post,
  boardName,
  customLink,
  isSelected,
  isPublishing,
  isGeneratingImage,
  showCheckbox = false,
  onSelect,
  onPublish,
  onSchedule,
  onGenerateImage,
  onEditLink,
  onDelete,
}: PostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { truncated, isTruncated } = truncateToThreeLines(post.description);
  const { truncated: descSnippet, isTruncated: isDescSnippetTruncated } = getTruncated(post.description)

  // determine if showMoreNeeded
  const showMoreNeeded = post.description.length > 120 && !expanded;

  return (
    <Card className={`relative transition-all ${isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""}`}>
      {showCheckbox && (
        <div className="absolute top-2 left-2 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect?.(post.id)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
        </div>
      )}

      {/* Action Icons */}
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
          onClick={() => onEditLink?.(post.id)}
        >
          <LinkIcon className={`h-4 w-4 ${customLink ? "text-green-600" : "text-gray-600"}`} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 bg-white/80 hover:bg-white text-red-600"
          onClick={() => onDelete?.(post.id)}
        >
          🗑️
        </Button>
      </div>

      <div className={`aspect-[9/16] relative`}>
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-contain bg-white"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Button
              onClick={() => onGenerateImage?.(post.id)}
              disabled={isGeneratingImage}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {isGeneratingImage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Image"
              )}
            </Button>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold line-clamp-2 mb-2">{post.title}</h3>
        <ExpandableDescription description={post.description} />

        {/* Link Display */}
        <div className="mb-3">
          <div className="bg-gray-50 rounded p-2">
            <div className="flex items-start gap-1">
              <span className="text-xs font-medium">Link:</span>
              <span className={`text-xs ${customLink ? "text-green-600" : "text-gray-600"} break-all flex-1`}>
                {customLink || post.defaultLink || "No link"}
                {customLink && <span className="text-green-600 ml-1">(Custom)</span>}
              </span>
            </div>
          </div>
        </div>

        {/* Board Assignment Tag */}
        <div className="mb-3">
          <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
            📌 {boardName}
          </span>
        </div>

        {/* Post action buttons */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onPublish?.(post.id)}
            disabled={isPublishing}
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
          >
            {isPublishing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <PinIcon className="mr-2 h-4 w-4" />
                Publish
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => onSchedule?.(post.id)}
            className="px-3"
          >
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 