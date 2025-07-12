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

function ConnectPinterestInline() {
  const [isConnecting, setIsConnecting] = useState(false)
  const handleClick = async () => {
    setIsConnecting(true)
    try {
      const res = await fetch("/api/pinterest/connect", { method: "POST" })
      if(!res.ok){ throw new Error("Failed") }
      const data = await res.json()
      window.location.href = data.url
    } catch(e){
      toast({ title:"Connection Failed", description:"Could not initiate Pinterest OAuth.", variant:"destructive" })
      setIsConnecting(false)
    }
  }
  return (
    <Button className="bg-red-600 hover:bg-red-700" onClick={handleClick} disabled={isConnecting}>
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...
        </>
      ) : (
        <>
          <PinIcon className="mr-2 h-4 w-4" /> Connect Pinterest
        </>
      )}
    </Button>
  )
}

function generateRandomFragment(length: number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function generateRandomUniqueDates(count: number) {
  const dates: string[] = [];
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0); // Start of today
  const usedTimestamps = new Set();

  while (dates.length < count) {
    // Random day within the next 7 days
    const randomDayOffset = Math.floor(Math.random() * 7); // 0-6 days ahead
    const randomDate = new Date(startDate.getTime() + randomDayOffset * 24 * 60 * 60 * 1000);
    // Random hour between 8 and 20 (8am to 8pm)
    const randomHour = 8 + Math.floor(Math.random() * 13); // 8-20
    // Random minute (0, 15, 30, 45)
    const randomMinute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
    randomDate.setHours(randomHour, randomMinute, 0, 0);
    const isoString = randomDate.toISOString().slice(0, 19); // 'YYYY-MM-DDTHH:mm:ss'
    if (!usedTimestamps.has(isoString)) {
      dates.push(isoString);
      usedTimestamps.add(isoString);
    }
  }
  return dates;
}

// Update ExpandableDescription component
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

export function CreatePostContent({ initialUrl }: CreatePostContentProps) {
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
    if (!url && activeTab === "url") {
      toast({
        title: "URL Required",
        description: "Please enter a URL to generate posts.",
        variant: "destructive",
      })
      return
    }

    if (!topic && activeTab === "scratch") {
      toast({
        title: "Topic Required",
        description: "Please enter a topic to generate posts.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
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

      if (!response.ok) {
        throw new Error("Failed to generate posts")
      }

      const data = await response.json()
      setGeneratedPosts(data.posts)
    } catch (error) {
      console.error("Error generating posts:", error)
      toast({
        title: "Error",
        description: "Failed to generate posts. Please try again.",
        variant: "destructive",
      })
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

  try {
    const response = await fetch("/api/pinterest/schedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        boardId: selectedBoard,
        imageUrl: currentPostForScheduling.imageUrl,
        title: currentPostForScheduling.title,
        description: currentPostForScheduling.description,
        link: postLinks[currentPostForScheduling.id] || currentPostForScheduling.defaultLink || "",
        scheduledTime: finalDateTime.toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to schedule post");
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

    setIsGeneratingImage(postId)
    try {
      const response = await fetch("/api/fal/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: post.title,
          description: post.description,
          imagePrompt: post.imagePrompt,
          imageSize,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate image")
      }

      const data = await response.json()
      
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
        link: postLinks[post.id] || post.defaultLink || "",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to publish post");
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
      const publishDate = String(randomDates[idx]).trim();
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
        newPostLinks[postId] = linkAllText
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

  const confirmScheduleAll = () => {
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

    generatedPosts.forEach(async (post) => {
      if (selectedPosts.has(post.id)) {
        try {
          const response = await fetch("/api/posts/schedule", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              boardId: selectedBoard,
              posts: [
                {
                  id: post.id,
                  title: post.title,
                  description: post.description,
                  imageUrl: post.imageUrl,
                  link: postLinks[post.id] || post.defaultLink,
                  scheduledTime: finalDateTime.toISOString(),
                },
              ],
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to schedule post to Pinterest");
          }
        } catch (error) {
          console.error("Error scheduling post:", error);
          toast({
            title: "Error",
            description: "Failed to schedule some posts. Please try again.",
            variant: "destructive",
          });
        }
      }
    });

    const remainingPosts = generatedPosts.filter((post) => !selectedPosts.has(post.id));
    setGeneratedPosts(remainingPosts);
    setSelectedPosts(new Set());
    setIsSelectAllActive(false);
    setScheduleAllDialogOpen(false);
    setScheduleAllDate(undefined);
    setScheduleAllTime("");

    toast({
      title: "Posts Scheduled",
      description: `Successfully scheduled ${selectedPosts.size} posts for ${format(finalDateTime, "PPP 'at' p")}.`,
    });
  };

  const { data: session } = useSession()
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

  return (
    <div className="space-y-6">

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
                <Select value={imageSize} onValueChange={(val) => {
  if(!isPremium && (val === "1:1" || val === "16:9")){
    toast({
      title:"Premium Feature",
      description:"Upgrade to premium to use Square or Landscape image sizes.",
    })
    return;
  }
  setImageSize(val)
}}>
  <SelectTrigger>
    <SelectValue placeholder="Select image size" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="9:16">Vertical (9:16)</SelectItem>
    <SelectItem value="1:1" className={!isPremium ? "opacity-50 cursor-not-allowed flex justify-between" : "flex justify-between"}>
      <span>Square (1:1)</span>
      {!isPremium && <Link href="/pricing" onClick={(e)=>e.stopPropagation()} className="text-teal-600 hover:underline text-xs">Upgrade</Link>}
    </SelectItem>
    <SelectItem value="16:9" className={!isPremium ? "opacity-50 cursor-not-allowed flex justify-between" : "flex justify-between"}>
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
              disabled={selectedPosts.size === 0}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Selected
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (!requireBoard()) return;
                setPublishDialogOpen(true);
              }}
              disabled={selectedPosts.size === 0}
            >
              <PinIcon className="w-4 h-4 mr-2" />
              Publish to Pinterest
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
                />
              );
            })}
          </div>
        </div>
      )}

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
            <Input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
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
                  <Input
                    id="schedule-all-time"
                    type="time"
                    value={scheduleAllTime}
                    onChange={(e) => setScheduleAllTime(e.target.value)}
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
    </div>
  )
}
