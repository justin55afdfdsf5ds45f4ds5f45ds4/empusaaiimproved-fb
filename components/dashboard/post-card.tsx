import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Eye,
  Heart,
  Share2,
  Calendar,
  PinIcon,
  LinkIcon,
  Loader2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSession } from "next-auth/react"

interface PostCardProps {
  post: {
    id: string
    title: string
    description: string
    imageUrl: string | null
    defaultLink?: string
    status?: "draft" | "scheduled" | "published" | "error"
    scheduledFor?: string
    publishedAt?: string
    createdAt?: string
    errorReason?: string
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
  onRetry?: (id: string) => void
  className?: string
  imageSize?: string
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
  onRetry,
  imageSize = "9:16"
}: PostCardProps) {
  // Remove session and isPremium check since individual actions are free

  // Function to get aspect ratio class based on image size
  const getAspectRatioClass = (size: string) => {
    switch (size) {
      case "1:1":
        return "aspect-square"; // 1:1
      case "16:9":
        return "aspect-video"; // 16:9
      case "9:16":
        return "aspect-[9/16]"; // 9:16
      case "2:3":
        return "aspect-[2/3]"; // 2:3
      default:
        return "aspect-[9/16]"; // default to 9:16
    }
  };

  // Function to get status badge configuration
  const getStatusConfig = (status?: string) => {
    switch (status) {
      case "published":
        return {
          icon: CheckCircle,
          text: "Published",
          className: "bg-green-100 text-green-800 border-green-200"
        };
      case "scheduled":
        return {
          icon: Clock,
          text: "Scheduled",
          className: "bg-blue-100 text-blue-800 border-blue-200"
        };
      case "error":
        return {
          icon: AlertCircle,
          text: "Error",
          className: "bg-red-100 text-red-800 border-red-200"
        };
      default:
        return {
          icon: FileText,
          text: "Draft",
          className: "bg-gray-100 text-gray-800 border-gray-200"
        };
    }
  };

  return (
    <Card className={`relative transition-all flex flex-col h-auto ${isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""}`}>
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

      <div className={`${getAspectRatioClass(imageSize)} relative`}>
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover bg-white"
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

        {/* Status and Board Assignment */}
        <div className="mb-3 flex flex-wrap gap-2">
          {/* Status Badge */}
          {(() => {
            const statusConfig = getStatusConfig(post.status);
            const StatusIcon = statusConfig.icon;
            return (
              <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border ${statusConfig.className}`}>
                <StatusIcon className="h-3 w-3" />
                {statusConfig.text}
              </span>
            );
          })()}
          
          {/* Board Assignment Tag */}
          <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
            📌 {boardName}
          </span>
        </div>

        {/* Error Message Display */}
        {post.status === "error" && post.errorReason && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-red-700 font-medium">Error occurred</p>
                <p className="text-xs text-red-600 mt-1">{post.errorReason}</p>
              </div>
            </div>
          </div>
        )}

        {/* Post action buttons */}
        <div className="flex items-center gap-2">
          {post.status === "error" ? (
            <>
              <Button
                onClick={() => onRetry?.(post.id)}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Fix and Republish
              </Button>
              <Button
                variant="outline"
                onClick={() => onSchedule?.(post.id)}
                className="px-3"
              >
                <Calendar className="h-4 w-4" />
              </Button>
            </>
          ) : post.status === "published" ? (
            <div className="flex-1 text-center py-2 text-sm text-green-600 font-medium">
              ✅ Successfully Published
            </div>
          ) : post.status === "scheduled" ? (
            <div className="flex-1 text-center py-2 text-sm text-blue-600 font-medium">
              🕒 Scheduled for {post.scheduledFor ? new Date(post.scheduledFor).toLocaleDateString() : 'later'}
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
