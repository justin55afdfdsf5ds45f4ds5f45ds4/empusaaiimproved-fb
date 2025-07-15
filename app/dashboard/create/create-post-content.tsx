"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Upload,
  Loader2,
  LinkIcon,
  Calendar,
  Info,
  RefreshCw,
  AlertCircle,
  Lock,
  Crown,
  PinIcon,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { TimeSelect } from "@/components/ui/time-select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSession } from "next-auth/react"
import { PostCard } from "@/components/dashboard/post-card"
import { PinterestAuth } from "@/components/pinterest-auth"
// Remove the direct import of daily-limits
// import { getRemainingLimits, incrementDailyLimit, getTimeUntilReset } from "@/lib/daily-limits";

// Add utility functions
function generateRandomFragment(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateRandomUniqueDates(count: number): Date[] {
  const dates: Date[] = [];
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  
  for (let i = 0; i < count; i++) {
    const randomDays = Math.floor(Math.random() * 30); // Random day within next 30 days
    const date = new Date(now.getTime() + (randomDays * oneDay));
    date.setHours(9 + Math.floor(Math.random() * 12)); // Random hour between 9 AM and 8 PM
    date.setMinutes(Math.floor(Math.random() * 60));
    dates.push(date);
  }
  
  return dates.sort((a, b) => a.getTime() - b.getTime());
}

function getTimeUntilReset(nextResetTime: Date): string {
  const now = new Date();
  const diffMs = nextResetTime.getTime() - now.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${diffHrs}h ${diffMins}m`;
}

// Add ConnectPinterestInline component
const ConnectPinterestInline = () => {
  return (
    <div className="mt-4">
      <PinterestAuth />
    </div>
  );
};

interface Post {
  id: string
  title: string
  description: string
  imagePrompt?: string
  imageUrl: string | null
  defaultLink?: string
}

interface PinterestBoard {
  id: string
  name: string
  url: string
}

interface CreatePostContentProps {
  initialUrl?: string
}

interface LimitInfo {
  postsGenerated: { remaining: number; nextResetTime: Date };
  postsPublished: { remaining: number; nextResetTime: Date };
  postsScheduled: { remaining: number; nextResetTime: Date };
  isPremium: boolean;
}

// Move LimitsAlert component definition to the top, before CreatePostContent
const LimitsAlert = ({ limits, isLoadingLimits }: { limits: LimitInfo | null; isLoadingLimits: boolean }) => {
  if (!limits || isLoadingLimits) return null;

  const hasReachedAnyLimit = 
    limits.postsGenerated.remaining === 0 ||
    limits.postsPublished.remaining === 0 ||
    limits.postsScheduled.remaining === 0;

  if (!hasReachedAnyLimit) return null;

  return (
    <Alert variant={limits.isPremium ? "default" : "destructive"} className="mb-4">
      <AlertTitle>Daily Limits Status</AlertTitle>
      <AlertDescription>
        <div className="space-y-1">
          {limits.postsGenerated.remaining === 0 && (
            <p>• Post generation will reset in {getTimeUntilReset(limits.postsGenerated.nextResetTime)}</p>
          )}
          {limits.postsPublished.remaining === 0 && (
            <p>• Publishing will reset in {getTimeUntilReset(limits.postsPublished.nextResetTime)}</p>
          )}
          {limits.postsScheduled.remaining === 0 && (
            <p>• Scheduling will reset in {getTimeUntilReset(limits.postsScheduled.nextResetTime)}</p>
          )}
          {!limits.isPremium && (
            <p className="mt-2">
              <a href="/pricing" className="text-blue-600 hover:underline">
                Upgrade to premium
              </a>{" "}
              for higher limits!
            </p>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export function CreatePostContent({ initialUrl }: CreatePostContentProps) {
  const { data: session } = useSession(); // Move session declaration to top
  const router = useRouter()
  const [url, setUrl] = useState(initialUrl || "")
  const [postCount, setPostCount] = useState("1")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showGeneratingWait, setShowGeneratingWait] = useState(false)
  const [isPublishing, setIsPublishing] = useState<string | null>(null)
  const [isGeneratingImage, setIsGeneratingImage] = useState<string | null>(null)
  const [referenceImage, setReferenceImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [generatedPosts, setGeneratedPosts] = useState<Post[]>([])
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined)
  const [scheduledTime, setScheduledTime] = useState<string>("")
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [currentPostForScheduling, setCurrentPostForScheduling] = useState<Post | null>(null)
  const [activeTab, setActiveTab] = useState("url")
  const [pinterestBoards, setPinterestBoards] = useState<PinterestBoard[]>([])
  const [selectedBoard, setSelectedBoard] = useState<string>("")
  const [isFetchingBoards, setIsFetchingBoards] = useState(false)
  const [boardFetchError, setBoardFetchError] = useState<string | null>(null)
  const [topic, setTopic] = useState("")
  const [tone, setTone] = useState("informative")
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set())
  const [isSelectAllActive, setIsSelectAllActive] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<Post | null>(null)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [postToLink, setPostToLink] = useState<Post | null>(null)
  const [customLink, setCustomLink] = useState("")
  const [postLinks, setPostLinks] = useState<Record<string, string>>({})
  const [publishDialogOpen, setPublishDialogOpen] = useState(false)
  const [selectedBoardForPosts, setSelectedBoardForPosts] = useState<Record<string, string>>({})
  const [imageSize, setImageSize] = useState("9:16")

  // New state for bulk operations
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false)
  const [deleteAllConfirmText, setDeleteAllConfirmText] = useState("")
  const [linkAllDialogOpen, setLinkAllDialogOpen] = useState(false)
  const [linkAllText, setLinkAllText] = useState("")
  const [scheduleAllDialogOpen, setScheduleAllDialogOpen] = useState(false)
  const [scheduleAllDate, setScheduleAllDate] = useState<Date | undefined>(undefined)
  const [showSchedulePopup, setShowSchedulePopup] = useState(false)

  // Add scheduleAllTime state
  const [scheduleAllTime, setScheduleAllTime] = useState<string>("");

  // Add state for daily limits
  const [limits, setLimits] = useState<LimitInfo | null>(null);
  const [isLoadingLimits, setIsLoadingLimits] = useState(true);
  const [error, setError] = useState<{ title: string; description: string; action?: string } | null>(null);

  // Set the initial URL and tab if provided
  useEffect(() => {
    if (initialUrl) {
      setUrl(initialUrl)
      setActiveTab("url")
    }
  }, [initialUrl])

  // Replace the fetchBoards function with mock data
  const fetchBoards = async () => {
    setIsFetchingBoards(true)
    setBoardFetchError(null)

    try {
      const response = await fetch("/api/pinterest/boards")

      if (response.status === 403) {
        setBoardFetchError("You haven't connected Pinterest yet.")
        return
      }

      if (!response.ok) {
        throw new Error("Failed to fetch Pinterest boards")
      }

      const data = await response.json()
      console.log(data)
      setPinterestBoards(data.boards || [])

      if (!selectedBoard && data.boards?.length > 0) {
        setSelectedBoard(data.boards[0].id)
      }
    } catch (error) {
      console.error("Error fetching Pinterest boards:", error)
      setBoardFetchError("Failed to fetch Pinterest boards. Please try again.")
    } finally {
      setIsFetchingBoards(false)
    }
  }

  useEffect(() => {
    fetchBoards()
  }, [])

  useEffect(() => {
    async function fetchLimits() {
      if (!session?.user?.id) return;
      setIsLoadingLimits(true);
      try {
        const response = await fetch('/api/user/limits');
        const data = await response.json();
        setLimits(data);
      } catch (error) {
        console.error('Error fetching limits:', error);
      } finally {
        setIsLoadingLimits(false);
      }
    }

    fetchLimits();
  }, [session?.user?.id]);

  const requireBoard = () => {
    if (!selectedBoard) {
      toast({
        title: "Board Required",
        description: "Please select a Pinterest board before proceeding.",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const handleGenerate = async () => {
    if (!session?.user?.id) return;
    setError(null); // Clear any previous errors

    // Check generation limits
    if (limits?.postsGenerated.remaining === 0) {
      const limitType = limits.isPremium ? "Premium" : "Free";
      const maxPosts = limits.isPremium ? "100" : "10";
      const resetTime = getTimeUntilReset(new Date(limits.postsGenerated.nextResetTime));

      // Determine appropriate upgrade CTA
      let actionText: string | undefined;
      if (!limits.isPremium) {
        // Free user -> suggest Premium
        actionText = "Upgrade to Premium for 100 posts per day";
      } else {
        // Premium user -> suggest Enterprise
        actionText = "Upgrade to Enterprise for unlimited posts per day";
      }

      const errorMsg = {
        title: `${limitType} Plan Daily Limit Reached`,
        description: `You have reached your daily limit of ${maxPosts} posts. Your limits will reset in ${resetTime}.`,
        action: actionText,
      };
      setError(errorMsg);
      toast({
        title: errorMsg.title,
        description: errorMsg.description,
        variant: "destructive",
      });
      return;
    }

    if (!url && activeTab === "url") {
      setError({
        title: "URL Required",
        description: "Please enter a URL to generate posts.",
      });
      toast({
        title: "URL Required",
        description: "Please enter a URL to generate posts.",
        variant: "destructive",
      })
      return
    }

    if (!topic && activeTab === "scratch") {
      setError({
        title: "Topic Required",
        description: "Please enter a topic to generate posts.",
      });
      toast({
        title: "Topic Required",
        description: "Please enter a topic to generate posts.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setError(null);
    // show wait message after 30s
    const waitTimer = setTimeout(()=> setShowGeneratingWait(true), 30000)

    try {
      const response = await fetch("/api/posts/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: activeTab === "url" ? url : undefined,
          topic: activeTab === "scratch" ? topic : undefined,
          tone,
          count: parseInt(postCount),
          imageSize,
        }),
      })

      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 403 && data.details) {
          // Handle detailed limit error
          setError({
            title: data.details.title,
            description: data.details.description,
            action: data.details.action,
          });
          toast({
            title: data.details.title,
            description: (
              <div className="space-y-2">
                <p>{data.details.description}</p>
                {data.details.action && (
                  <Link 
                    href="/pricing" 
                    className="text-white underline hover:text-blue-100 block"
                  >
                    {data.details.action}
                  </Link>
                )}
              </div>
            ),
            variant: "destructive",
          });
        } else {
          // Handle other errors
          const errorMsg = {
            title: "Generation Failed",
            description: data.error || "Failed to generate posts",
          };
          setError(errorMsg);
          toast({
            title: errorMsg.title,
            description: errorMsg.description,
            variant: "destructive",
          });
        }
        throw new Error(data.error || "Failed to generate posts");
      }

      setGeneratedPosts(data.posts)
      setError(null);

      // Update limits after successful generation
      const limitsResponse = await fetch('/api/user/limits');
      const newLimits = await limitsResponse.json();
      setLimits(newLimits);
    } catch (error) {
      console.error("Error generating posts:", error)
      if (!error) {
        const errorMsg = {
          title: "Error",
          description: "Failed to generate posts. Please try again.",
        };
        setError(errorMsg);
        toast({
          title: errorMsg.title,
          description: errorMsg.description,
          variant: "destructive",
        });
      }
    } finally {
      setIsGenerating(false)
      clearTimeout(waitTimer)
      setShowGeneratingWait(false)
    }
  }

  // Update handleSchedule function
  const handleSchedule = (postId: string) => {
  if (!requireBoard()) return;
  const post = generatedPosts.find(p => p.id === postId);
  if (post) {
    setCurrentPostForScheduling(post);
    setScheduledDate(undefined);
    setScheduledTime("");
    setScheduleDialogOpen(true);
  }
};

  // Update handleConfirmSchedule function
  const handleConfirmSchedule = async () => {
  if (!currentPostForScheduling || !scheduledDate || !scheduledTime) {
    toast({
      title: "Error",
      description: "Please select both date and time to schedule the post.",
      variant: "destructive",
    });
    return;
  }

  const [hours, minutes] = scheduledTime.split(":").map(Number);
  const finalDateTime = new Date(scheduledDate);
  finalDateTime.setHours(hours, minutes, 0, 0);

  const linkVal = postLinks[currentPostForScheduling.id] || currentPostForScheduling.defaultLink || "";
  if (!linkVal) {
    const proceed = confirm("This post doesn't have a link. Schedule anyway?");
    if (!proceed) return;
  }

  try {
    const response = await fetch("/api/posts/schedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        boardId: selectedBoard,
        posts: [{
          id: currentPostForScheduling.id,
          title: currentPostForScheduling.title,
          description: currentPostForScheduling.description,
          imageUrl: currentPostForScheduling.imageUrl,
          link: linkVal,
          scheduledTime: finalDateTime.toISOString(),
        }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      if (response.status === 403 && data.details) {
        toast({
          title: data.details.title,
          description: (
            <div className="space-y-2">
              <p>{data.details.description}</p>
              {data.details.action && (
                <Link href="/pricing" className="text-white underline hover:text-blue-100 block">
                  {data.details.action}
                </Link>
              )}
            </div>
          ),
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to schedule post. Please try again.",
          variant: "destructive",
        });
      }
      return;
    }

    // Remove the scheduled post from the list
    setGeneratedPosts((prev) => prev.filter((p) => p.id !== currentPostForScheduling.id));
    setSelectedPosts((prev) => {
      const next = new Set(prev);
      next.delete(currentPostForScheduling.id);
      return next;
    });

    setScheduleDialogOpen(false);
    setScheduledDate(undefined);
    setScheduledTime("");
    setCurrentPostForScheduling(null);

    toast({
      title: "Post Scheduled",
      description: `Successfully scheduled post for ${format(finalDateTime, "PPP 'at' p")}.`,
    });
  } catch (error) {
    console.error("Error scheduling post:", error);
    toast({
      title: "Error",
      description: "Failed to schedule post. Please try again.",
      variant: "destructive",
    });
  }
};

  const handleGenerateImage = async (postId: string) => {
    const post = generatedPosts.find(p => p.id === postId)
    if (!post) return

    console.log('Generating image with size:', imageSize);
    setIsGeneratingImage(postId)
    try {
      const requestBody = {
        title: post.title,
        description: post.description,
        imagePrompt: post.imagePrompt,
        imageSize,
      };
      console.log('Image generation request:', requestBody);

      const response = await fetch("/api/fal/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error("Failed to generate image")
      }

      const data = await response.json()
      console.log('Image generation response:', data);
      
      // Update the post with the generated image URL
      setGeneratedPosts((prevPosts) =>
        prevPosts.map((p) => (p.id === postId ? { ...p, imageUrl: data.imageUrl } : p))
      )
    } catch (error) {
      console.error("Error generating image:", error)
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingImage(null)
    }
  }

  const handlePublish = async (postId: string) => {
  if (!requireBoard()) {
    return;
  }

  const post = generatedPosts.find(p => p.id === postId);
  if (!post) return;

  const linkValue = postLinks[post.id] || post.defaultLink || "";
  if (!linkValue) {
    const proceed = confirm("This post doesn't have a link. Publish anyway?");
    if (!proceed) return;
  }

  setIsPublishing(postId);
  try {
    const response = await fetch("/api/pinterest/pins", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        boardId: selectedBoardForPosts[postId] || selectedBoard,
        title: post.title,
        description: post.description,
        imageUrl: post.imageUrl,
        link: linkValue,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      if (response.status === 403 && data.details) {
        toast({
          title: data.details.title,
          description: (
            <div className="space-y-2">
              <p>{data.details.description}</p>
              {data.details.action && (
                <Link href="/pricing" className="text-white underline hover:text-blue-100 block">
                  {data.details.action}
                </Link>
              )}
            </div>
          ),
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to publish post. Please try again.",
          variant: "destructive",
        });
      }
      return;
    }

    toast({
      title: "Published!",
      description: "Post has been published to Pinterest.",
    });

    // Remove the published post from the list
    setGeneratedPosts((prev) => prev.filter((p) => p.id !== postId));
    setSelectedPosts((prev) => {
      const next = new Set(prev);
      next.delete(postId);
      return next;
    });
  } catch (error) {
    console.error("Error publishing post:", error);
    toast({
      title: "Error",
      description: "Failed to publish post. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsPublishing(null);
  }
};

  const handleEditLink = (postId: string) => {
    const post = generatedPosts.find(p => p.id === postId)
    if (post) {
      setPostToLink(post)
      setCustomLink(postLinks[post.id] || post.defaultLink || "")
      setLinkDialogOpen(true)
    }
  }

  const handleDelete = (postId: string) => {
    const post = generatedPosts.find(p => p.id === postId)
    if (post) {
      setPostToDelete(post)
      setDeleteDialogOpen(true)
    }
  }

  const togglePostSelection = (postId: string) => {
    setSelectedPosts((prev) => {
      const next = new Set(prev)
      if (next.has(postId)) {
        next.delete(postId)
      } else {
        next.add(postId)
      }
      return next
    })
  }

  const confirmDelete = () => {
    if (postToDelete && deleteConfirmText === "delete") {
      setGeneratedPosts((prev) => prev.filter((p) => p.id !== postToDelete.id))
      setSelectedPosts((prev) => {
        const next = new Set(prev)
        next.delete(postToDelete.id)
        return next
      })
      setDeleteDialogOpen(false)
      setPostToDelete(null)
      setDeleteConfirmText("")
    }
  }

  const confirmLink = () => {
    if (postToLink && customLink) {
      setPostLinks((prev) => ({
        ...prev,
        [postToLink.id]: customLink,
      }))

      toast({
        title: "Link Added",
        description: "Custom link has been added to the post.",
      })
    }
    setLinkDialogOpen(false)
    setPostToLink(null)
    setCustomLink("")
  }

  const handleBoardSelection = (postId: string, boardId: string) => {
    setSelectedBoardForPosts((prev) => ({
      ...prev,
      [postId]: boardId,
    }))
  }

  const getSelectedBoard = (postId: string) => {
    return selectedBoardForPosts[postId] || selectedBoard
  }

  const hasSelectedPosts = selectedPosts.size > 0
  const getButtonClass = (isActive: boolean) =>
    `px-4 py-2 rounded-md font-medium transition-colors ${
      isActive ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }`

  const handleDownloadCsv = () => {
    if (!generatedPosts.length) {
      toast({
        title: "No posts",
        description: "Generate posts first to export CSV.",
        variant: "destructive"
      });
      return;
    }

    const missingImages = generatedPosts.filter(post => !post.imageUrl);
    if (missingImages.length > 0) {
      toast({
        title: "Images Not Ready",
        description: "Please wait for all images to generate before downloading CSV",
        variant: "default",
      });
      return;
    }

    const randomDates = generateRandomUniqueDates(generatedPosts.length);
    const headers = [
      "Title",
      "Media URL",
      "Pinterest board",
      "Description",
      "Link",
      "Publish date",
    ];

    const rows = generatedPosts.map((post, idx) => {
      const boardName = pinterestBoards.find((b) => b.id === selectedBoard)?.name || "Weight Loss";
      let link = postLinks[post.id] || post.defaultLink || "";
      if (link) {
        const frag = generateRandomFragment(10);
        link += `#${frag}`;
      }
      // Output date as unquoted ISO 8601 string, trimmed
      const publishDate = randomDates[idx].toISOString().split(".")[0];
      return [
        post.title?.trim() ?? "",
        post.imageUrl && post.imageUrl.startsWith('http') ? post.imageUrl.trim() : '',
        boardName.trim(),
        post.description?.trim() ?? "",
        link.trim(),
        publishDate, // Unquoted, ISO 8601 format
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((v, i) => (i === 5 ? v : `"${String(v).replace(/"/g, '""')}"`)) // Only quote non-date columns
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pinterest-posts-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Fix Select All functionality
  const handleSelectAll = () => {
    if (isSelectAllActive) {
      setSelectedPosts(new Set());
      setIsSelectAllActive(false);
    } else {
      setSelectedPosts(new Set(generatedPosts.map(post => post.id)));
      setIsSelectAllActive(true);
    }
  };

  const handleDeleteAll = () => {
    if (selectedPosts.size === 0) {
      toast({
        title: "No Posts Selected",
        description: "Please select posts to delete.",
        variant: "destructive",
      })
      return
    }
    setDeleteAllDialogOpen(true)
    setDeleteAllConfirmText("")
  }

  const confirmDeleteAll = () => {
    if (deleteAllConfirmText === "DELETE") {
      const remainingPosts = generatedPosts.filter((post) => !selectedPosts.has(post.id))
      setGeneratedPosts(remainingPosts)
      setSelectedPosts(new Set())
      setIsSelectAllActive(false)
      setDeleteAllDialogOpen(false)
      setDeleteAllConfirmText("")

      toast({
        title: "Posts Deleted",
        description: `Successfully deleted ${selectedPosts.size} posts.`,
      })
    }
  }

  const handleLinkAllPosts = () => {
    if (selectedPosts.size === 0) {
      toast({
        title: "No Posts Selected",
        description: "Please select posts to add links.",
        variant: "destructive",
      })
      return
    }
    setLinkAllDialogOpen(true)
    setLinkAllText("")
  }

  const confirmLinkAll = () => {
    if (linkAllText) {
      const newPostLinks = { ...postLinks }
      selectedPosts.forEach((postId) => {
        newPostLinks[postId] = `${linkAllText}#${generateRandomFragment(8)}`
      })
      setPostLinks(newPostLinks)
      setLinkAllDialogOpen(false)
      setLinkAllText("")

      toast({
        title: "Links Added",
        description: `Successfully added custom links to ${selectedPosts.size} posts.`,
      })
    }
  }

  const handleScheduleAll = () => {
    if (selectedPosts.size === 0) {
      toast({
        title: "No Posts Selected",
        description: "Please select posts to schedule.",
        variant: "destructive",
      })
      return
    }
    setScheduleAllDialogOpen(true)
    setScheduleAllDate(undefined)
  }

  const confirmScheduleAll = async () => {
    if (!scheduleAllDate || !scheduleAllTime) {
      toast({
        title: "Date and Time Required",
        description: "Please select both date and time for scheduling.",
        variant: "destructive",
      });
      return;
    }

    const [hours, minutes] = scheduleAllTime.split(":").map(Number);
    const finalDateTime = new Date(scheduleAllDate);
    finalDateTime.setHours(hours, minutes, 0, 0);

    // Check scheduling limits before attempting API call
    if (limits) {
      const remain = limits.postsScheduled.remaining;
      if (remain === 0 || selectedPosts.size > remain) {
        toast({
          title: limits.isPremium ? "Daily Scheduling Limit Reached" : "Free Plan Limit Reached",
          description: `You can schedule more posts in ${getTimeUntilReset(new Date(limits.postsScheduled.nextResetTime))}. ${
            !limits.isPremium ? "Upgrade to Premium for higher limits!" : "Upgrade to Enterprise for unlimited posts!"
          }`,
          variant: "destructive",
        });
        return;
      }
    }

    try {
      const selectedPostsArray = generatedPosts.filter(post => selectedPosts.has(post.id));
      const postsToSchedule = selectedPostsArray.map((post, index) => ({
        id: post.id,
        title: post.title,
        description: post.description,
        imageUrl: post.imageUrl,
        link: postLinks[post.id] || post.defaultLink || "",
        scheduledTime: new Date(finalDateTime.getTime() + (index * 60 * 60 * 1000)).toISOString(), // 1 hour apart
      }));

      const response = await fetch("/api/posts/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          boardId: selectedBoard,
          posts: postsToSchedule,
        }),
      });

      const respData = await response.json();
      if (!response.ok) {
        if (response.status === 403 && respData.details) {
          toast({
            title: respData.details.title,
            description: (
              <div className="space-y-2">
                <p>{respData.details.description}</p>
                {respData.details.action && (
                  <Link href="/pricing" className="text-white underline hover:text-blue-100 block">
                    {respData.details.action}
                  </Link>
                )}
              </div>
            ),
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: respData.error || "Failed to schedule posts. Please try again.",
            variant: "destructive",
          });
        }
        return;
      }

      // Remove scheduled posts from the list
      setGeneratedPosts((prev) => prev.filter((post) => !selectedPosts.has(post.id)));
      setSelectedPosts(new Set());
      setIsSelectAllActive(false);
      setScheduleAllDialogOpen(false);
      setScheduleAllDate(undefined);
      setScheduleAllTime("");

      toast({
        title: "Posts Scheduled",
        description: `Successfully scheduled ${selectedPosts.size} posts starting from ${format(finalDateTime, "PPP 'at' p")}.`,
      });
    } catch (error) {
      console.error("Error scheduling posts:", error);
      toast({
        title: "Error",
        description: "Failed to schedule posts. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBulkPublish = async () => {
    if (selectedPosts.size === 0) {
      toast({
        title: "No Posts Selected",
        description: "Please select posts to publish.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedBoard) {
      toast({
        title: "Board Required",
        description: "Please select a Pinterest board to publish your posts.",
        variant: "destructive",
      });
      return;
    }

    setPublishDialogOpen(true);
  };

  const confirmBulkPublish = async () => {
    if (!session?.user?.id) return;

    // Check publishing limits
    const selectedCount = selectedPosts.size;
    if (limits) {
      const remaining = limits.postsPublished.remaining;
      if (remaining === 0 || selectedCount > remaining) {
        toast({
          title: limits.isPremium ? "Daily Publishing Limit Reached" : "Free Plan Limit Reached",
          description: `You can publish more posts in ${getTimeUntilReset(new Date(limits.postsPublished.nextResetTime))}. ${
            !limits.isPremium ? "Upgrade to Premium for higher limits!" : "Upgrade to Enterprise for unlimited posts!"
          }`,
          variant: "destructive",
        });
        return;
      }
    }

    try {
      setIsPublishing("bulk");
      const selectedPostsArray = generatedPosts.filter(post => selectedPosts.has(post.id));

      // Try to publish each post
      for (const post of selectedPostsArray) {
        try {
          // Try to publish
          const response = await fetch("/api/pinterest/pins/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              boardId: selectedBoardForPosts[post.id] || selectedBoard,
              title: post.title,
              description: post.description,
              imageUrl: post.imageUrl,
              link: postLinks[post.id] || post.defaultLink,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();

            // Handle daily limit error details
            if (response.status === 403 && errorData.details) {
              toast({
                title: errorData.details.title,
                description: (
                  <div className="space-y-2">
                    <p>{errorData.details.description}</p>
                    {errorData.details.action && (
                      <Link href="/pricing" className="text-white underline hover:text-blue-100 block">
                        {errorData.details.action}
                      </Link>
                    )}
                  </div>
                ),
                variant: "destructive",
              });
              break; // stop further processing
            }

            // If Pinterest spam/limit error, try to schedule instead
            if (errorData.error?.includes("spam") || errorData.error?.includes("limit")) {
              const scheduleTime = generateRandomScheduleTime();
              const scheduleResponse = await fetch("/api/posts/schedule", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  boardId: selectedBoardForPosts[post.id] || selectedBoard,
                  posts: [{
                    id: post.id,
                    title: post.title,
                    description: post.description,
                    imageUrl: post.imageUrl,
                    link: postLinks[post.id] || post.defaultLink,
                    scheduledTime: scheduleTime.toISOString(),
                  }],
                }),
              });

              if (scheduleResponse.ok) {
                // Remove the post from the list
                setGeneratedPosts((prev) => prev.filter((p) => p.id !== post.id));
                setSelectedPosts((prev) => {
                  const next = new Set(prev);
                  next.delete(post.id);
                  return next;
                });
                continue;
              }
            }
          } else {
            // Successfully published, remove from list
            setGeneratedPosts((prev) => prev.filter((p) => p.id !== post.id));
            setSelectedPosts((prev) => {
              const next = new Set(prev);
              next.delete(post.id);
              return next;
            });
          }
        } catch (error) {
          console.error(`Error processing post ${post.id}:`, error);
        }
      }

      // Update limits
      const limitsResponse = await fetch('/api/user/limits');
      const newLimits = await limitsResponse.json();
      setLimits(newLimits);

      toast({
        title: "Posts Processed",
        description: "Finished processing selected posts.",
      });
    } catch (error) {
      console.error("Error in bulk publish:", error);
      toast({
        title: "Error",
        description: "Some posts failed to process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(null);
      setPublishDialogOpen(false);
    }
  };

  const isPremium = session?.user?.premiumUntil && new Date(session.user.premiumUntil) > new Date()

  const handlePostCountChange = (val:string) => {
    if(!isPremium && (parseInt(val) > 2)){
      toast({
        title:"Premium Feature",
        description:"Upgrade to premium to generate more than 2 posts at once.",
      })
      return;
    }
    setPostCount(val)
  }

  // Post count options array
  const postCountOptions = [
    { value: "1", label: "1 post", premium: false },
    { value: "2", label: "2 posts", premium: false },
    { value: "5", label: "5 posts", premium: true },
    { value: "20", label: "20 posts", premium: true },
    { value: "50", label: "50 posts", premium: true },
    { value: "100", label: "100 posts", premium: true },
  ];

  function generateRandomScheduleTime(daysAhead: number = 7): Date {
    const now = new Date();
    const randomDays = Math.floor(Math.random() * daysAhead);
    const result = new Date(now);
    result.setDate(result.getDate() + randomDays);
    // Set random hour between 9 AM and 8 PM
    result.setHours(9 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60), 0, 0);
    return result;
  }

  return (
    <div className="space-y-6">
      {/* Remove LimitsAlert */}
      
      {/* Board Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Pinterest Board</CardTitle>
          <CardDescription>Select the board to publish your posts to</CardDescription>
        </CardHeader>
        <CardContent>
          {boardFetchError || pinterestBoards.length === 0 ? (
            <div className="space-y-3">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Connect Pinterest</AlertTitle>
                <AlertDescription>
                  {boardFetchError ? "Failed to fetch Pinterest boards." : "No Pinterest boards found."}
                </AlertDescription>
              </Alert>
              <ConnectPinterestInline />
            </div>
          ) : (
            <Select value={selectedBoard} onValueChange={setSelectedBoard}>
              <SelectTrigger>
                <SelectValue placeholder="Select a board" />
              </SelectTrigger>
              <SelectContent>
                {pinterestBoards.map((board) => (
                  <SelectItem key={board.id} value={board.id}>
                    {board.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {/* Generation Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Pinterest Content</CardTitle>
          <CardDescription>Choose how you want to create your Pinterest content</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="url">From URL</TabsTrigger>
              <TabsTrigger value="scratch">From Scratch</TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="url">Enter URL</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      id="url"
                      placeholder="https://example.com/your-content"
                      className="pl-10"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="scratch" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  placeholder="Enter your topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="informative">Informative</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="postCount">Number of Posts</Label>
                <Select value={postCount} onValueChange={handlePostCountChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of posts" />
                  </SelectTrigger>
                  <SelectContent>
                    {postCountOptions.map(opt => (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        className={opt.premium && !isPremium ? "opacity-50 cursor-not-allowed flex justify-between" : "flex justify-between"}
                      >
                        <span>{opt.label}</span>
                        {opt.premium && !isPremium && (
                          <Link href="/pricing" onClick={(e)=>e.stopPropagation()} className="text-teal-600 hover:underline text-xs">Upgrade</Link>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Generate more than 2 posts at once with {" "}
                  <Link href="/pricing" className="text-teal-600 hover:underline">Premium</Link>.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageSize">Image Size</Label>
                <Select 
                  value={imageSize} 
                  onValueChange={(val) => {
                    // For non-premium users, only allow 9:16
                    if (!isPremium && (val === "1:1" || val === "16:9")) {
                      toast({
                        title: "Premium Feature",
                        description: "Upgrade to premium to use Square or Landscape image sizes.",
                      });
                      // Keep the current value (9:16) instead of changing
                      return;
                    }
                    console.log('Setting image size to:', val);
                    setImageSize(val);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select image size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9:16">Vertical (9:16)</SelectItem>
                    <SelectItem 
                      value="1:1" 
                      className={!isPremium ? "opacity-50 cursor-not-allowed flex justify-between" : "flex justify-between"}
                      disabled={!isPremium}
                    >
                      <span>Square (1:1)</span>
                      {!isPremium && <Link href="/pricing" onClick={(e)=>e.stopPropagation()} className="text-teal-600 hover:underline text-xs">Upgrade</Link>}
                    </SelectItem>
                    <SelectItem 
                      value="16:9" 
                      className={!isPremium ? "opacity-50 cursor-not-allowed flex justify-between" : "flex justify-between"}
                      disabled={!isPremium}
                    >
                      <span>Landscape (16:9)</span>
                      {!isPremium && <Link href="/pricing" onClick={(e)=>e.stopPropagation()} className="text-teal-600 hover:underline text-xs">Upgrade</Link>}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Unlock Square & Landscape sizes with {" "}
                  <Link href="/pricing" className="text-teal-600 hover:underline">Premium</Link>.
                </p>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-teal-600 hover:bg-teal-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Generate Posts
                  </>
                )}
              </Button>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Generated Posts Section */}
      {showGeneratingWait && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>Please wait, your content is on the way...</AlertDescription>
        </Alert>
      )}
      
      {generatedPosts.length > 0 && (
        <div className="space-y-4">
          {/* Action Buttons Row */}
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={handleSelectAll}
              variant={isSelectAllActive ? "default" : "outline"}
              className={isSelectAllActive ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              {isSelectAllActive ? "Deselect All" : "Select All"}
            </Button>
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700"
              onClick={handleDeleteAll}
              disabled={selectedPosts.size === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete All Selected
            </Button>
            <Button
              variant="outline"
              onClick={() => setLinkAllDialogOpen(true)}
              disabled={selectedPosts.size === 0}
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              Link All Selected
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (!requireBoard()) return;
                setScheduleAllDialogOpen(true);
              }}
              disabled={selectedPosts.size === 0 || !isPremium}
            >
              {!isPremium ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Selected
                        <Crown className="w-4 h-4 ml-2 text-yellow-500" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Upgrade to Premium to schedule multiple posts at once</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Selected
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleBulkPublish}
              disabled={selectedPosts.size === 0 || !isPremium}
            >
              {!isPremium ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        <PinIcon className="w-4 h-4 mr-2" />
                        Publish to Pinterest
                        <Crown className="w-4 h-4 ml-2 text-yellow-500" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Upgrade to Premium to publish multiple posts at once</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <>
                  <PinIcon className="w-4 h-4 mr-2" />
                  Publish to Pinterest
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleDownloadCsv}>
              Download CSV
            </Button>
          </div>

          {/* Posts Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {generatedPosts.map((post) => {
              const boardId = selectedBoardForPosts[post.id] || selectedBoard;
              const boardName = pinterestBoards.find(b => b.id === boardId)?.name || "No board";
              
              return (
                <PostCard
                  key={post.id}
                  post={{
                    id: post.id,
                    title: post.title,
                    description: post.description,
                    imageUrl: post.imageUrl,
                    defaultLink: post.defaultLink,
                  }}
                  boardName={boardName}
                  customLink={postLinks[post.id]}
                  isSelected={selectedPosts.has(post.id)}
                  isPublishing={isPublishing === post.id}
                  isGeneratingImage={isGeneratingImage === post.id}
                  showCheckbox={true}
                  onSelect={togglePostSelection}
                  onPublish={handlePublish}
                  onSchedule={handleSchedule}
                  onGenerateImage={handleGenerateImage}
                  onEditLink={handleEditLink}
                  onDelete={handleDelete}
                  imageSize={imageSize}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Error Alert - Updated styling */}
      {error && (
        <Alert variant="default" className="mb-4 bg-gray-100 border-gray-200">
          <AlertCircle className="h-4 w-4 text-gray-500" />
          <AlertTitle className="text-gray-700 font-medium">{error.title}</AlertTitle>
          <AlertDescription className="text-gray-600 mt-1">
            <p>{error.description}</p>
            {error.action && (
              <div className="mt-2">
                <Link 
                  href="/pricing" 
                  className="text-blue-600 hover:text-blue-700 inline-flex items-center font-medium"
                >
                  {error.action}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Remove daily limits display */}

      {/* Schedule Dialog */}
<Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Schedule Post</DialogTitle>
      <DialogDescription>
        Choose when to publish this post
      </DialogDescription>
    </DialogHeader>
    <div className="py-4">
      <div className="space-y-4">
        <div>
          <Label>Date</Label>
          <div className="mt-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={scheduledDate}
                  onSelect={setScheduledDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div>
          <Label>Time</Label>
          <div className="mt-2">
            <TimeSelect
              value={scheduledTime}
              onValueChange={setScheduledTime}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>
        Cancel
      </Button>
      <Button 
        className="bg-teal-600 hover:bg-teal-700" 
        onClick={handleConfirmSchedule} 
        disabled={!scheduledDate || !scheduledTime}
      >
        Schedule
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Type "delete" to confirm.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder="Type 'delete' to confirm"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteConfirmText !== "delete"}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
            <DialogDescription>
              Enter a custom link for this post
            </DialogDescription>
          </DialogHeader>
          <Input
            value={customLink}
            onChange={(e) => setCustomLink(e.target.value)}
            placeholder="https://example.com"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmLink} disabled={!customLink}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete All Confirmation Dialog */}
      <Dialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete All Selected Posts</DialogTitle>
            <DialogDescription>Do you want to delete all selected posts?</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4 p-3 border rounded-lg bg-red-50">
              <p className="font-medium text-red-800">You are about to delete {selectedPosts.size} posts</p>
              <p className="text-sm text-red-600 mt-1">This action cannot be undone.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="delete-all-confirm">Type DELETE to confirm deletion</Label>
              <Input
                id="delete-all-confirm"
                value={deleteAllConfirmText}
                onChange={(e) => setDeleteAllConfirmText(e.target.value)}
                placeholder="Type DELETE"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteAllDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteAll} disabled={deleteAllConfirmText !== "DELETE"}>
              Delete All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link All Posts Dialog */}
      <Dialog open={linkAllDialogOpen} onOpenChange={setLinkAllDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Link All Selected Posts</DialogTitle>
            <DialogDescription>Enter a custom link for all {selectedPosts.size} selected posts</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="link-all-input">Custom Link URL</Label>
              <Input
                id="link-all-input"
                value={linkAllText}
                onChange={(e) => setLinkAllText(e.target.value)}
                placeholder="https://example.com"
              />
              <p className="text-xs text-gray-500">
                This link will be applied to all {selectedPosts.size} selected posts
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkAllDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmLinkAll} disabled={!linkAllText} className="bg-green-600 hover:bg-green-700">
              Apply to All Posts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule All Posts Dialog */}
      <Dialog open={scheduleAllDialogOpen} onOpenChange={setScheduleAllDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule All Selected Posts</DialogTitle>
            <DialogDescription>Select a date and time to schedule all {selectedPosts.size} selected posts</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="schedule-all-date">Date</Label>
                <div className="mt-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {scheduleAllDate ? format(scheduleAllDate, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={scheduleAllDate}
                        onSelect={setScheduleAllDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div>
                <Label htmlFor="schedule-all-time">Time</Label>
                <div className="mt-2">
                  <TimeSelect
                    value={scheduleAllTime}
                    onValueChange={setScheduleAllTime}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleAllDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-teal-600 hover:bg-teal-700" 
              onClick={confirmScheduleAll} 
              disabled={!scheduleAllDate || !scheduleAllTime}
            >
              Schedule All Posts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Publish Dialog */}
      <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Publish Posts to Pinterest</DialogTitle>
            <DialogDescription>
              You are about to publish {selectedPosts.size} posts to Pinterest board "{pinterestBoards.find(b => b.id === selectedBoard)?.name || 'Selected Board'}"
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4 p-3 border rounded-lg bg-blue-50">
              <p className="font-medium text-blue-800">Publishing Details:</p>
              <ul className="mt-2 text-sm text-blue-700 space-y-1">
                <li>• Number of posts: {selectedPosts.size}</li>
                <li>• Board: {pinterestBoards.find(b => b.id === selectedBoard)?.name}</li>
                {Object.keys(selectedBoardForPosts).length > 0 && (
                  <li>• Some posts have custom board selections</li>
                )}
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPublishDialogOpen(false)}
              disabled={isPublishing === "bulk"}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmBulkPublish}
              disabled={isPublishing === "bulk"}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {isPublishing === "bulk" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish All"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  )
}
