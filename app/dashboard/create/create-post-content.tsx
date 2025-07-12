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
  PinIcon,
  RefreshCw,
  AlertCircle,
  Trash2,
  Lock,
  Crown,
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
import { useSession } from "next-auth/react";

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
}

interface CreatePostContentProps {
  initialUrl?: string
}

export function CreatePostContent({ initialUrl }: CreatePostContentProps) {
  const router = useRouter()
  const [url, setUrl] = useState(initialUrl || "")
  const [postCount, setPostCount] = useState("1")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPublishing, setIsPublishing] = useState<string | null>(null)
  const [isScheduling, setIsScheduling] = useState<string | null>(null)
  const [Scheduling, setSceduling] = useState(false)
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
  const [imageSize, setImageSize] = useState("9:16");

  // New state for bulk operations
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false)
  const [deleteAllConfirmText, setDeleteAllConfirmText] = useState("")
  const [linkAllDialogOpen, setLinkAllDialogOpen] = useState(false)
  const [linkAllText, setLinkAllText] = useState("")
  const [scheduleAllDialogOpen, setScheduleAllDialogOpen] = useState(false)
  const [scheduleAllDate, setScheduleAllDate] = useState<Date | undefined>(undefined)
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);

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
        setBoardFetchError("You haven’t connected Pinterest yet.")
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

  // Replace the useEffect with a simpler version
  useEffect(() => {
    fetchBoards()
  }, [])

  function getMinTime(date?: Date) {
    if (!date) return undefined

    const now = new Date()
    const isToday = now.toDateString() === new Date(date).toDateString()

    if (isToday) {
      // Round current time up to nearest 5 minutes
      const rounded = new Date(now)
      rounded.setSeconds(0)
      rounded.setMilliseconds(0)
      const minutes = rounded.getMinutes()
      rounded.setMinutes(minutes + (5 - (minutes % 5)))

      const hours = String(rounded.getHours()).padStart(2, "0")
      const mins = String(rounded.getMinutes()).padStart(2, "0")
      return `${hours}:${mins}`
    }

    return undefined
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setReferenceImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setReferenceImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const generateImage = async (post: Post) => {
    if (!post.imagePrompt) return null

    setIsGeneratingImage(post.id)

    try {
      const response = await fetch("/api/fal/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: post.imagePrompt,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate image")
      }

      const data = await response.json()
      console.log("Generating image")
      console.log(data.images)
      return data.images?.[0]?.url || null
    } catch (error) {
      console.error("Error generating image:", error)
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      })
      return null
    } finally {
      setIsGeneratingImage(null)
    }
  }

  const handleGenerate = async () => {
    if (activeTab === "url" && !url) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to generate Pinterest posts.",
        variant: "destructive",
      });
      return;
    }

    if (activeTab === "scratch" && !topic) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic or keywords to generate Pinterest posts.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      let referenceImageBase64 = null;
      if (referenceImage) {
        referenceImageBase64 = await new Promise<string | null>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(referenceImage);
        });
      }
      const response = await fetch("/api/posts/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: activeTab === "url" ? url : undefined,
          topic: activeTab === "scratch" ? topic : undefined,
          tone: activeTab === "scratch" ? tone : undefined,
          count: parseInt(postCount, 10),
          boardId: selectedBoard,
          imageSize,
          referenceImage: referenceImageBase64, // Send reference image to backend
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate posts")
      }

      const data = await response.json()
      setGeneratedPosts(
        (data.posts || []).map((post: Post) => ({
          ...post,
          defaultLink: activeTab === "url" ? url : undefined,
        }))
      )

      toast({
        title: "Posts Generated",
        description: `Successfully generated ${data.posts.length} Pinterest posts.`,
      })
    } catch (error) {
      console.error("Error generating posts:", error)
      toast({
        title: "Error",
        description: "Failed to generate posts. Please try again.",
        variant: "destructive",
      })
    }
    setIsGenerating(false)
  }

  const handleGenerateImage = async (post: Post) => {
    const imageUrl = await generateImage(post)

    if (imageUrl) {
      // Update the post with the generated image URL
      setGeneratedPosts((prevPosts) => prevPosts.map((p) => (p.id === post.id ? { ...p, imageUrl } : p)))
    }
  }

  const handlePublish = async (post: Post) => {
    if (!requireBoard()) {
      return
    }

    setIsPublishing(post.id)
    try {
      const response = await fetch("/api/posts/publish", {
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
              link: postLinks[post.id] || post.defaultLink || "",
            },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to publish post")
      }

      toast({
        title: "Published!",
      })

      // Remove the published post from the list
      setGeneratedPosts((prev) => prev.filter((p) => p.id !== post.id))
    } catch (error) {
      console.error("Error publishing post:", error)
      toast({
        title: "Error",
        description: "Failed to publish post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPublishing(null)
    }
  }

  const openScheduleDialog = async (post: Post) => {
    setShowSchedulePopup(true);
  };

  const handleSchedule = async () => {
    console.log("In handle schedule")
    if (!currentPostForScheduling || !scheduledDate || !selectedBoard) {
      toast({
        title: "Error",
        description: "Please select a date and board to schedule the post.",
        variant: "destructive",
      })
      return
    }

    // Generate image if not already generated
    let postWithImage = currentPostForScheduling
    if (!postWithImage.imageUrl) {
      toast({
        title: "Generating Image",
        description: "Generating image before scheduling...",
      })

      const imageUrl = await generateImage(postWithImage)

      if (!imageUrl) {
        toast({
          title: "Error",
          description: "Failed to generate image. Please try again.",
          variant: "destructive",
        })
        return
      }

      // Update the post with the generated image
      postWithImage = { ...postWithImage, imageUrl }
      setGeneratedPosts((prevPosts) => prevPosts.map((p) => (p.id === postWithImage.id ? { ...postWithImage } : p)))
    }

    setIsScheduling(postWithImage.id)
    const [hours, minutes] = scheduledTime.split(":").map(Number);
    const finalDateTime = new Date(scheduledDate);
    finalDateTime.setHours(hours, minutes, 0, 0);

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
              id: postWithImage.id,
              title: postWithImage.title,
              description: postWithImage.description,
              imageUrl: postWithImage.imageUrl,
              link: postLinks[postWithImage.id] || postWithImage.defaultLink,
              scheduledTime: finalDateTime,
            },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to schedule post to Pinterest")
      }

      toast({
        title: "Post Scheduled",
        description: "Your post has been successfully published to Pinterest.",
      })

      // Remove the scheduled post from the list
      setGeneratedPosts(generatedPosts.filter((p) => p.id !== postWithImage.id))
      setScheduleDialogOpen(false)
      setScheduledDate(undefined)
      setIsScheduling(null)
    } catch (error) {
      console.error("Error scheduling post:", error)
      toast({
        title: "Error",
        description: "Failed to schedule post. Please try again.",
        variant: "destructive",
      })
      setIsScheduling(null)
    }
  }

  const handleSelectAll = () => {
    if (isSelectAllActive) {
      setSelectedPosts(new Set())
      setIsSelectAllActive(false)
    } else {
      setSelectedPosts(new Set(generatedPosts.map((post) => post.id)))
      setIsSelectAllActive(true)
    }
  }

  const togglePostSelection = (postId: string) => {
    const newSelected = new Set(selectedPosts)
    if (newSelected.has(postId)) {
      newSelected.delete(postId)
    } else {
      newSelected.add(postId)
    }
    setSelectedPosts(newSelected)
    setIsSelectAllActive(newSelected.size === generatedPosts.length)
  }

  const handleDeletePost = (post: Post) => {
    setPostToDelete(post)
    setDeleteDialogOpen(true)
    setDeleteConfirmText("")
  }

  const confirmDelete = () => {
    if (deleteConfirmText === "DELETE" && postToDelete) {
      setGeneratedPosts(generatedPosts.filter((p) => p.id !== postToDelete.id))
      setSelectedPosts((prev) => {
        const newSet = new Set(prev)
        newSet.delete(postToDelete.id)
        return newSet
      })
      setDeleteDialogOpen(false)
      setPostToDelete(null)
      setDeleteConfirmText("")

      toast({
        title: "Post Deleted",
        description: "The post has been successfully deleted.",
      })
    }
  }

  // New function for Delete All
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

  // New function for Link All Posts
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

  // New function for Schedule All
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
    if (scheduleAllDate) {
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
                    scheduledTime: scheduleAllDate,
                  },
                ],
              }),
            })

            if (!response.ok) {
              throw new Error("Failed to schedule post to Pinterest")
            }
          } catch (error) {
            console.log(error)
          }
        }
      })
      const remainingPosts = generatedPosts.filter((post) => !selectedPosts.has(post.id))
      setGeneratedPosts(remainingPosts)
      setSelectedPosts(new Set())
      setIsSelectAllActive(false)
      setScheduleAllDialogOpen(false)
      setScheduleAllDate(undefined)

      toast({
        title: "Posts Scheduled",
        description: `Successfully scheduled ${selectedPosts.size} posts for ${format(scheduleAllDate, "PPP")}.`,
      })
    }
  }

  const handleLinkPost = (post: Post) => {
    setPostToLink(post)
    setCustomLink(postLinks[post.id] || "")
    setLinkDialogOpen(true)
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

  // Locked post counts
  const lockedCounts = ["5", "20", "50", "100"];

  // Custom onValueChange to prevent selecting locked options
  const handlePostCountChange = (value: string) => {
    if (lockedCounts.includes(value)) {
      return;
    }
    setPostCount(value);
  };

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

  function downloadCSV() {
    if (!generatedPosts.length) return;
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
  }

  const { data: session } = useSession();
  const isPremium = session?.user?.premiumUntil && new Date(session.user.premiumUntil) > new Date();

  interface PremiumButtonProps {
    icon: any
    label: string
    onClick?: () => void
    disabled?: boolean
    className?: string
    tooltip?: string
  }

  const PremiumButton = ({ icon: Icon, label, onClick, disabled = false, className = "", tooltip }: PremiumButtonProps) => {
    if (isPremium) {
      const btn = (
        <Button
          variant="outline"
          onClick={onClick}
          disabled={disabled}
          className={`relative group border-gray-300 hover:bg-gray-100 ${className}`}
        >
          <Icon className="w-4 h-4 mr-2" />
          <span>{label}</span>
        </Button>
      )

      if (tooltip) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>{btn}</TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      }

      return btn
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              disabled
              className={`relative group border-gray-300 text-gray-500 cursor-not-allowed ${className}`}
            >
              <Lock className="w-4 h-4 mr-2" />
              <span>{label}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>This is a premium feature. Please upgrade to access.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  const requireBoard = () => {
    if (!selectedBoard) {
      const t = toast({
        title: "Board not selected",
        description: "Please connect and select a Pinterest board before publishing or scheduling posts.",
        variant: "destructive",
      })
      setTimeout(() => t.dismiss(), 2000)

      // Scroll board selection into view for clarity
      const el = document.getElementById("board-section")
      el?.scrollIntoView({ behavior: "smooth", block: "center" })

      // Temporary red ring highlight
      if (el) {
        el.classList.add("ring-2", "ring-red-500")
        setTimeout(() => el.classList.remove("ring-2", "ring-red-500"), 2000)
      }
      return false
    }
    return true
  }

  return (
    <>
      {/* Pinterest Board Selection */}
      <Card id="board-section" className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <PinIcon className="h-5 w-5 text-red-600" />
            Pinterest Board
          </CardTitle>
          <CardDescription>Select the Pinterest board where you want to publish your posts</CardDescription>
        </CardHeader>
        <CardContent>
          {boardFetchError ? (
            <Alert
              variant={boardFetchError === "You haven’t connected Pinterest yet." ? "default" : "destructive"}
              className="mb-4"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className={boardFetchError === "You haven’t connected Pinterest yet." ? "text-gray-700" : ""}>
                {boardFetchError === "You haven’t connected Pinterest yet."
                  ? "Pinterest Not Connected"
                  : "Error Fetching Boards"}
              </AlertTitle>
              <AlertDescription
                className={boardFetchError === "You haven’t connected Pinterest yet." ? "text-gray-600" : ""}
              >
                {boardFetchError === "You haven’t connected Pinterest yet." ? (
                  <>
                    Please connect your Pinterest account to continue.
                    <div className="mt-3">
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => router.push("/dashboard/settings/social")}
                      >
                        <PinIcon className="mr-2 h-4 w-4" />
                        Connect Pinterest
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {boardFetchError}
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={fetchBoards}
                      disabled={isFetchingBoards}
                    >
                      <RefreshCw className={`mr-2 h-4 w-4 ${isFetchingBoards ? "animate-spin" : ""}`} />
                      Retry
                    </Button>
                  </>
                )}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="board">Select Board</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchBoards}
                  disabled={isFetchingBoards}
                  className="h-8 px-2 text-xs"
                >
                  <RefreshCw className={`mr-1 h-3 w-3 ${isFetchingBoards ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
              <Select value={selectedBoard} onValueChange={setSelectedBoard} disabled={isFetchingBoards}>
                <SelectTrigger className={!selectedBoard ? "text-red-500 border-red-500" : ""}>
                  <SelectValue placeholder={isFetchingBoards ? "Loading boards..." : "Select a board"} />
                </SelectTrigger>
                <SelectContent>
                  {pinterestBoards.length === 0 ? (
                    <SelectItem value="no-boards" disabled>
                      No boards found
                    </SelectItem>
                  ) : (
                    pinterestBoards.map((board) => (
                      <SelectItem key={board.id} value={board.id}>
                        {board.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {!selectedBoard && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  You must select a Pinterest board to publish or schedule posts
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Always render the form section */}
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
                  <Select value={postCount} onValueChange={handlePostCountChange}>
                    <SelectTrigger className="w-[120px]">
                      <span>{postCount ? `${postCount} post${postCount !== "1" ? "s" : ""}` : "1 post"}</span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 post</SelectItem>
                      <SelectItem value="2">2 posts</SelectItem>
                      {isPremium ? (
                        <>
                          <SelectItem value="5">5 posts</SelectItem>
                          <SelectItem value="20">20 posts</SelectItem>
                          <SelectItem value="50">50 posts</SelectItem>
                          <SelectItem value="100">100 posts</SelectItem>
                        </>
                      ) : (
                        <>
                          <div className="px-2 py-1.5 text-sm text-gray-400 flex items-center gap-2 cursor-not-allowed select-none">
                            5 posts <span className="ml-2">🔒 <a href='/pricing' className='underline text-xs text-gray-400' target='_blank' rel='noopener noreferrer' tabIndex={0} onClick={e => e.stopPropagation()}>Upgrade</a></span>
                          </div>
                          <div className="px-2 py-1.5 text-sm text-gray-400 flex items-center gap-2 cursor-not-allowed select-none">
                            20 posts <span className="ml-2">🔒 <a href='/pricing' className='underline text-xs text-gray-400' target='_blank' rel='noopener noreferrer' tabIndex={0} onClick={e => e.stopPropagation()}>Upgrade</a></span>
                          </div>
                          <div className="px-2 py-1.5 text-sm text-gray-400 flex items-center gap-2 cursor-not-allowed select-none">
                            50 posts <span className="ml-2">🔒 <a href='/pricing' className='underline text-xs text-gray-400' target='_blank' rel='noopener noreferrer' tabIndex={0} onClick={e => e.stopPropagation()}>Upgrade</a></span>
                          </div>
                          <div className="px-2 py-1.5 text-sm text-gray-400 flex items-center gap-2 cursor-not-allowed select-none">
                            100 posts <span className="ml-2">🔒 <a href='/pricing' className='underline text-xs text-gray-400' target='_blank' rel='noopener noreferrer' tabIndex={0} onClick={e => e.stopPropagation()}>Upgrade</a></span>
                          </div>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Our AI will analyze the content at this URL and generate Pinterest posts
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-size">Image Size</Label>
                <Select value={imageSize} onValueChange={setImageSize}>
                  <SelectTrigger className="w-[120px]">
                    <span>
                      {imageSize === "1:1"
                        ? "1:1 (Square)"
                        : imageSize === "16:9"
                        ? "16:9 (Landscape)"
                        : "9:16 (Portrait)"}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                    {isPremium ? (
                      <>
                        <SelectItem value="1:1">1:1 (Square)</SelectItem>
                        <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                      </>
                    ) : (
                      <>
                        <div className="px-2 py-1.5 text-sm text-gray-400 flex items-center gap-2 cursor-not-allowed select-none">
                          1:1 (Square) <span className="ml-2">🔒 <a href='/pricing' className='underline text-xs text-gray-400' target='_blank' rel='noopener noreferrer' tabIndex={0} onClick={e => e.stopPropagation()}>Upgrade</a></span>
                        </div>
                        <div className="px-2 py-1.5 text-sm text-gray-400 flex items-center gap-2 cursor-not-allowed select-none">
                          16:9 (Landscape) <span className="ml-2">🔒 <a href='/pricing' className='underline text-xs text-gray-400' target='_blank' rel='noopener noreferrer' tabIndex={0} onClick={e => e.stopPropagation()}>Upgrade</a></span>
                        </div>
                      </>
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Only 9:16 is available on the free plan. Upgrade to unlock more sizes.
                </p>
              </div>

              <div className="space-y-2 mt-6">
                <Label>Reference Image (Optional)</Label>
                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors relative" // Added relative positioning
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => !previewUrl && document.getElementById("file-upload")?.click()} // Prevent click if previewUrl exists to allow delete button to work
                >
                  <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  {previewUrl ? (
                    <div className="flex flex-col items-center">
                      <div className="relative w-40 h-40 mb-4">
                        <img
                          src={previewUrl || "/placeholder.svg"} // Removed placeholder fallback
                          alt="Reference"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation() // Prevent triggering the div's onClick
                            setReferenceImage(null)
                            setPreviewUrl(null)
                            // Also clear the file input value if possible
                            const fileInput = document.getElementById("file-upload") as HTMLInputElement
                            if (fileInput) {
                              fileInput.value = ""
                            }
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">Click or drag to replace</p>
                    </div>
                  ) : (
                    // ... existing code for when no image is previewed
                    <div className="flex flex-col items-center">
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG or WEBP (max. 5MB)</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="scratch" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic or Keywords</Label>
                <Input
                  id="topic"
                  placeholder="E.g., healthy recipes, home decor ideas, travel tips"
                  className="w-full"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Enter a topic or keywords for your Pinterest content
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tone">Content Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="informative">Informative</SelectItem>
                      <SelectItem value="inspirational">Inspirational</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual & Friendly</SelectItem>
                      <SelectItem value="humorous">Humorous</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="count">Number of Posts</Label>
                  <Select value={postCount} onValueChange={handlePostCountChange}>
                    <SelectTrigger>
                      <span>{postCount ? `${postCount} post${postCount !== "1" ? "s" : ""}` : "1 post"}</span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 post</SelectItem>
                      <SelectItem value="2">2 posts</SelectItem>
                      {isPremium ? (
                        <>
                          <SelectItem value="5">5 posts</SelectItem>
                          <SelectItem value="20">20 posts</SelectItem>
                          <SelectItem value="50">50 posts</SelectItem>
                          <SelectItem value="100">100 posts</SelectItem>
                        </>
                      ) : (
                        <>
                          <div className="px-2 py-1.5 text-sm text-gray-400 flex items-center gap-2 cursor-not-allowed select-none">
                            5 posts <span className="ml-2">🔒 <a href='/pricing' className='underline text-xs text-gray-400' target='_blank' rel='noopener noreferrer' tabIndex={0} onClick={e => e.stopPropagation()}>Upgrade</a></span>
                          </div>
                          <div className="px-2 py-1.5 text-sm text-gray-400 flex items-center gap-2 cursor-not-allowed select-none">
                            20 posts <span className="ml-2">🔒 <a href='/pricing' className='underline text-xs text-gray-400' target='_blank' rel='noopener noreferrer' tabIndex={0} onClick={e => e.stopPropagation()}>Upgrade</a></span>
                          </div>
                          <div className="px-2 py-1.5 text-sm text-gray-400 flex items-center gap-2 cursor-not-allowed select-none">
                            50 posts <span className="ml-2">🔒 <a href='/pricing' className='underline text-xs text-gray-400' target='_blank' rel='noopener noreferrer' tabIndex={0} onClick={e => e.stopPropagation()}>Upgrade</a></span>
                          </div>
                          <div className="px-2 py-1.5 text-sm text-gray-400 flex items-center gap-2 cursor-not-allowed select-none">
                            100 posts <span className="ml-2">🔒 <a href='/pricing' className='underline text-xs text-gray-400' target='_blank' rel='noopener noreferrer' tabIndex={0} onClick={e => e.stopPropagation()}>Upgrade</a></span>
                          </div>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-size">Image Size</Label>
                <Select value={imageSize} onValueChange={() => {}}>
                  <SelectTrigger className="w-[120px]">
                    <span>9:16 (Portrait)</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                    {isPremium ? (
                      <>
                        <SelectItem value="1:1">1:1 (Square)</SelectItem>
                        <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                        <SelectItem value="2:3">2:3 (Pinterest)</SelectItem>
                      </>
                    ) : (
                      <>
                        <div className="px-2 py-1.5 text-sm text-gray-400 flex items-center gap-2 cursor-not-allowed select-none">
                          1:1 (Square) <span className="ml-2">🔒 <a href='/pricing' className='underline text-xs text-gray-400' target='_blank' rel='noopener noreferrer' tabIndex={0} onClick={e => e.stopPropagation()}>Upgrade</a></span>
                        </div>
                        <div className="px-2 py-1.5 text-sm text-gray-400 flex items-center gap-2 cursor-not-allowed select-none">
                          16:9 (Landscape) <span className="ml-2">🔒 <a href='/pricing' className='underline text-xs text-gray-400' target='_blank' rel='noopener noreferrer' tabIndex={0} onClick={e => e.stopPropagation()}>Upgrade</a></span>
                        </div>
                        <div className="px-2 py-1.5 text-sm text-gray-400 flex items-center gap-2 cursor-not-allowed select-none">
                          2:3 (Pinterest) <span className="ml-2">🔒 <a href='/pricing' className='underline text-xs text-gray-400' target='_blank' rel='noopener noreferrer' tabIndex={0} onClick={e => e.stopPropagation()}>Upgrade</a></span>
                        </div>
                      </>
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Only 9:16 is available on the free plan. Upgrade to unlock more sizes.
                </p>
              </div>

              <div className="space-y-2 mt-6">
                <Label>Reference Image (Optional)</Label>
                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors relative" // Added relative positioning
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => !previewUrl && document.getElementById("file-upload")?.click()} // Prevent click if previewUrl exists to allow delete button to work
                >
                  <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  {previewUrl ? (
                    <div className="flex flex-col items-center">
                      <div className="relative w-40 h-40 mb-4">
                        <img
                          src={previewUrl || "/placeholder.svg"} // Removed placeholder fallback
                          alt="Reference"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation() // Prevent triggering the div's onClick
                            setReferenceImage(null)
                            setPreviewUrl(null)
                            // Also clear the file input value if possible
                            const fileInput = document.getElementById("file-upload") as HTMLInputElement
                            if (fileInput) {
                              fileInput.value = ""
                            }
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">Click or drag to replace</p>
                    </div>
                  ) : (
                    // ... existing code for when no image is previewed
                    <div className="flex flex-col items-center">
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG or WEBP (max. 5MB)</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <Button
              className="w-full bg-teal-600 hover:bg-teal-700 mt-6"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Pinterest Posts
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </Tabs>
        </CardContent>
      </Card>

      {/* Conditionally render the generated posts section */}
      {generatedPosts.length > 0 && (
        <div className="space-y-6 mt-6">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Generated Posts ({generatedPosts.length})
            </h2>
            <Button
              variant="outline"
              onClick={() => {
                setUrl("");
                setTopic("");
                setReferenceImage(null);
                setPreviewUrl(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
                toast({
                  title: "Form Cleared",
                  description: "You can now generate new content.",
                });
              }}
            >
              Start New Generation
            </Button>
          </div>

          {/* Download CSV Button */}
          <div className="flex justify-end mb-4">
            <Button onClick={downloadCSV} variant="outline">
              Download CSV
            </Button>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-4 mt-4">
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
            <PremiumButton
              icon={Calendar}
              label="Schedule Selected"
              onClick={() => {
                if (!requireBoard()) return
                handleScheduleAll()
              }}
            />
            <PremiumButton
              icon={PinIcon}
              label="Publish to Pinterest"
              onClick={() => {
                if (!requireBoard()) return
                setPublishDialogOpen(true)
              }}
            />
          </div>

          {/* Board Selection for Selected Posts */}
          {hasSelectedPosts && (
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <Label>Default Board for Selected Posts ({selectedPosts.size} selected):</Label>
                <Select value={selectedBoard} onValueChange={setSelectedBoard}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Select board" />
                  </SelectTrigger>
                  <SelectContent>
                    {pinterestBoards.map((board) => (
                      <SelectItem key={board.id} value={board.id}>
                        {board.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Card>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {generatedPosts.map((post) => {
              const isSelected = selectedPosts.has(post.id)
              const hasCustomLink = postLinks[post.id]
              const displayLink = hasCustomLink || post.defaultLink || "No link available"
              const assignedBoard = getSelectedBoard(post.id)
              const boardName = pinterestBoards.find((b) => b.id === assignedBoard)?.name || "No board"

              return (
                <Card
                  key={post.id}
                  className={`relative transition-all ${
                    isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
                  }`}
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => togglePostSelection(post.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </div>

                  {/* Action Icons */}
                  <div className="absolute top-2 right-2 z-10 flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                      onClick={() => handleLinkPost(post)}
                    >
                      <LinkIcon className={`h-4 w-4 ${hasCustomLink ? "text-green-600" : "text-gray-600"}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 bg-white/80 hover:bg-white text-red-600"
                      onClick={() => handleDeletePost(post)}
                    >
                      🗑️
                    </Button>
                  </div>

                  {/* Dynamic aspect ratio frame based on selected size */}
                  <div className={`${imageSize === "1:1" ? "aspect-square" : imageSize === "16:9" ? "aspect-[16/9]" : "aspect-[9/16]"} relative`}>
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl || "/placeholder.svg?height=600&width=400&query=abstract+post+image"}
                        alt={post.title}
                        className="w-full h-full object-contain bg-white"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Button
                          onClick={() => handleGenerateImage(post)}
                          disabled={isGeneratingImage === post.id}
                          className="bg-teal-600 hover:bg-teal-700"
                        >
                          {isGeneratingImage === post.id ? (
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
                    {/* Update ExpandableDescription to show ... and toggle show more/less */}
                    <ExpandableDescription description={post.description} />

                    {/* Default/Custom Link Display */}
                    <div className="mb-3 p-2 bg-gray-50 rounded text-xs">
                      <span className="font-medium">Link: </span>
                      <span className={hasCustomLink ? "text-green-600" : "text-gray-600"}>{displayLink}</span>
                      {hasCustomLink && <span className="text-green-600 ml-1">(Custom)</span>}
                    </div>

                    {/* Board Assignment Tag */}
                    <div className="mb-3">
                      <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        📌 {boardName}
                      </span>
                    </div>

                    {/* Post action buttons */}
                    <div className="flex items-center gap-2">
                      <PremiumButton
                        icon={PinIcon}
                        label={isPublishing === post.id ? "Publishing..." : "Publish"}
                        onClick={() => handlePublish(post)}
                        disabled={isPublishing === post.id}
                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                      />
                      <PremiumButton
                        icon={Calendar}
                        label="Schedule"
                        onClick={() => {
                          if (!requireBoard()) return
                          setCurrentPostForScheduling(post)
                          setScheduleDialogOpen(true)
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

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
            <DialogDescription>Select a date to schedule all {selectedPosts.size} selected posts</DialogDescription>
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
                {/* Time Picker */}
            <div>
              <Label htmlFor="schedule-time">Time</Label>
              <input
                id="schedule-time"
                type="time"
                className="mt-2 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={scheduledTime}
                min={getMinTime(scheduledDate)}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleAllDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={confirmScheduleAll} disabled={!scheduleAllDate}>
              Schedule All Posts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>Do you want to delete this post?</DialogDescription>
          </DialogHeader>
          {postToDelete && (
            <div className="py-4">
              <div className="mb-4 p-3 border rounded-lg">
                <h4 className="font-medium">{postToDelete.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{postToDelete.description.substring(0, 100)}...</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="delete-confirm">Type DELETE to confirm deletion</Label>
                <Input
                  id="delete-confirm"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteConfirmText !== "DELETE"}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Post Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Custom Link</DialogTitle>
            <DialogDescription>Enter a custom destination link for this post</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="custom-link">Custom Link URL</Label>
              <Input
                id="custom-link"
                value={customLink}
                onChange={(e) => setCustomLink(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmLink} disabled={!customLink} className="bg-green-600 hover:bg-green-700">
              Save Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Publish to Pinterest Dialog */}
      <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Publish to Pinterest</DialogTitle>
            <DialogDescription>Select the Pinterest board to post these to:</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Pinterest Board</Label>
                <Select value={selectedBoard} onValueChange={setSelectedBoard}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select board" />
                  </SelectTrigger>
                  <SelectContent>
                    {pinterestBoards.map((board) => (
                      <SelectItem key={board.id} value={board.id}>
                        {board.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Posts to Publish ({selectedPosts.size})</Label>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {Array.from(selectedPosts).map((postId) => {
                    const post = generatedPosts.find((p) => p.id === postId)
                    return post ? (
                      <div key={postId} className="flex items-center gap-3 p-2 border rounded">
                        <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0">
                          {post.imageUrl && (
                            <img
                              src={post.imageUrl || "/placeholder.svg"}
                              alt=""
                              className="w-full h-full object-cover rounded"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{post.title}</p>
                          <p className="text-xs text-gray-500 truncate">{post.description}</p>
                        </div>
                      </div>
                    ) : null
                  })}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPublishDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                generatedPosts.forEach((post) => {
                  if (selectedPosts.has(post.id)) {
                    handlePublish(post)
                  }
                })
                const remainingPosts = generatedPosts.filter((post) => !selectedPosts.has(post.id))
                setGeneratedPosts(remainingPosts)
                setSelectedPosts(new Set())
                setIsSelectAllActive(false)
                setPublishDialogOpen(false)

                toast({
                  title: "Publishing to Pinterest",
                  description: `Successfully published ${selectedPosts.size} posts to Pinterest!`,
                })
              }}
            >
              Confirm Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule Post</DialogTitle>
            <DialogDescription>Select a date and time to schedule your Pinterest post.</DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-6">
            {/* Date Picker */}
            <div>
              <Label htmlFor="schedule-date">Date</Label>
              <div className="mt-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {scheduledDate ? format(scheduledDate, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={scheduledDate}
                      onSelect={setScheduledDate}
                      initialFocus
                      disabled={(date) => {
                        const today = new Date()
                        today.setHours(0, 0, 0, 0) // Remove time portion
                        return date < today // Only disable dates before today
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Time Picker */}
            <div>
              <Label htmlFor="schedule-time">Time</Label>
              <input
                id="schedule-time"
                type="time"
                className="mt-2 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={scheduledTime}
                min={getMinTime(scheduledDate)}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleSchedule} disabled={!scheduledDate || !scheduledTime}>
              {Scheduling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                "Schedule Post"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule CSV Recommendation Popup */}
      <Dialog open={showSchedulePopup} onOpenChange={setShowSchedulePopup}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Schedule Posts via CSV</DialogTitle>
            <DialogDescription>
              To schedule posts, we recommend downloading the CSV and uploading it to your scheduling tool.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 flex flex-col items-center">
            <Button onClick={() => { downloadCSV(); setShowSchedulePopup(false); }} className="bg-teal-600 hover:bg-teal-700 w-full">
              Download CSV
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSchedulePopup(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Update ExpandableDescription to show ... and toggle show more/less
function ExpandableDescription({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  // Show 'Show more' at the end of the third line if truncated
  const maxChars = 3 * 40; // Approximate 3 lines at 40 chars per line
  const shouldTruncate = description.length > maxChars;
  const displayText = !expanded && shouldTruncate ? description.slice(0, maxChars) : description;
  return (
    <div className="mb-4">
      <p className="text-sm text-gray-500" style={{ color: '#6B7280' }}>
        {displayText}
        {shouldTruncate && !expanded && (
          <span
            className="text-xs text-gray-500 hover:underline ml-1 cursor-pointer"
            onClick={() => setExpanded(true)}
            style={{ whiteSpace: 'nowrap' }}
          >
            ... Show more
          </span>
        )}
        {shouldTruncate && expanded && (
          <span
            className="text-xs text-gray-500 hover:underline ml-1 cursor-pointer"
            style={{ whiteSpace: 'nowrap', color: '#6B7280', fontWeight: 400, textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => setExpanded(false)}
          >
            Show less
          </span>
        )}
      </p>
    </div>
  );
}
