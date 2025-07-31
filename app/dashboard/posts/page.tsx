"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Shuffle, Lock, Crown, Calendar, Loader2, AlertCircle, HelpCircle, Edit3, Eye } from "lucide-react"
import Link from "next/link"
import { PostCard } from "@/components/dashboard/post-card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TimeSelect } from "@/components/ui/time-select"
import { DatePicker } from "@/components/ui/date-picker"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Toaster } from "@/components/ui/toaster"

function formatResetTime(date: Date){
  const diffMs = date.getTime()-new Date().getTime();
  const hrs=Math.floor(diffMs/ (1000*60*60));
  const mins=Math.floor((diffMs%(1000*60*60))/(1000*60));
  return `${hrs}h ${mins}m`;
}

interface Post {
  _id: string
  title: string
  description: string
  imageUrl: string
  imageSize?: string
  status: "draft" | "scheduled" | "published"
  scheduledFor?: string
  publishedAt?: string
  createdAt: string
  defaultLink?: string
  metrics?: {
    views: number
    likes: number
    shares: number
  }
}

export default function PostsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set())
  const [isPublishing, setIsPublishing] = useState<string | null>(null)
  const [pinterestBoards, setPinterestBoards] = useState<any[]>([])
  const [selectedBoardForPosts, setSelectedBoardForPosts] = useState<Record<string, string>>({})
  const [postLinks, setPostLinks] = useState<Record<string, string>>({})
  const [isBulkShuffleOpen, setIsBulkShuffleOpen] = useState(false)
  const [bulkLinks, setBulkLinks] = useState("")
  const [isScheduling, setIsScheduling] = useState(false)
  const [selectedBoardId, setSelectedBoardId] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [currentPostForScheduling, setCurrentPostForScheduling] = useState<Post | null>(null)
  const [missingFields, setMissingFields] = useState<string[]>([])
  const [eligibleCount, setEligibleCount] = useState(0)
  const [csvError, setCsvError] = useState("")
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [currentPostForLink, setCurrentPostForLink] = useState<Post | null>(null)
  const [linkInput, setLinkInput] = useState("")
  const [bulkPostLinks, setBulkPostLinks] = useState<Record<string, string>>({})
  const [showPostPreview, setShowPostPreview] = useState(false)
  // limits state
  interface LimitInfo {
    postsGenerated: { remaining: number; nextResetTime: Date };
    postsPublished: { remaining: number; nextResetTime: Date };
    postsScheduled: { remaining: number; nextResetTime: Date };
    isPremium: boolean;
  }
  const [limits,setLimits]=useState<LimitInfo|null>(null);
  const [isLoadingLimits,setIsLoadingLimits]=useState(false);

  const buildCsv = (rows: string[][]) => {
    return rows.map(r => r.map(v => {
      const val = v ?? ""
      const needsQuote = /[",\n]/.test(val)
      const escaped = String(val).replace(/"/g,'""')
      return needsQuote ? `"${escaped}"` : escaped
    }).join(",")).join("\n")
  }

  useEffect(() => {
    fetchPosts()
    fetchBoards()
    fetchLimits();
  }, [])

  async function fetchLimits(){
    try{
      setIsLoadingLimits(true);
      const res=await fetch('/api/user/limits');
      if(res.ok){
        const data=await res.json();
        setLimits(data);
      }
    }catch(e){console.error('limits fetch',e)}finally{setIsLoadingLimits(false)}
  }

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts/recentposts")
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
      toast({
        title: "Error",
        description: "Failed to fetch posts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBoards = async () => {
    try {
      const response = await fetch("/api/pinterest/boards")
      if (response.ok) {
        const data = await response.json()
        setPinterestBoards(data.boards || [])
      }
    } catch (error) {
      console.error("Error fetching Pinterest boards:", error)
    }
  }

  const handleBulkShuffleClick = () => {
    const isPremium = session?.user?.premiumUntil && new Date(session.user.premiumUntil) > new Date()
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description:
          "Upgrade to premium to use Bulk Shuffle Schedule! This feature automatically schedules your posts across peak hours with optimal timing.",
        variant: "default",
      })
      router.push("/pricing")
      return
    }
    // compute eligible posts (not published and not scheduled)
    const eligible = posts.filter(p => 
      selectedPosts.has(p._id) && 
      p.status !== "published" && 
      p.status !== "scheduled"
    ).length
    setEligibleCount(eligible)
    
    const initialLinks: Record<string, string> = {}
    posts.filter(p => 
      selectedPosts.has(p._id) && 
      p.status !== "published" && 
      p.status !== "scheduled"
    ).forEach(post => {
      initialLinks[post._id] = postLinks[post._id] || post.defaultLink || ""
    })
    setBulkPostLinks(initialLinks)
    
    setIsBulkShuffleOpen(true)
  }

  const handleBulkSchedule = async () => {
    if (!selectedBoardId || !bulkLinks.trim() || !selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsScheduling(true)

      // Split links by newline and filter empty lines
      const links = bulkLinks.split("\n").filter(link => link.trim())

      // Get eligible posts (not published and not scheduled)
      const selectedPostArray = posts.filter(
        post => selectedPosts.has(post._id) && 
        post.status !== "published" && 
        post.status !== "scheduled",
      )

      if (selectedPostArray.length === 0) {
        toast({
          title: "No Eligible Posts",
          description: "Selected posts have already been scheduled or published.",
          variant: "destructive",
        })
        return
      }

      // Combine date and time for base schedule time
      const baseScheduleTime = new Date(selectedDate)
      const [hours, minutes] = selectedTime.split(":")
      baseScheduleTime.setHours(parseInt(hours), parseInt(minutes))

      // Schedule each post with assigned link
      for (let i = 0; i < selectedPostArray.length; i++) {
        const post = selectedPostArray[i]
        const postLink = bulkPostLinks[post._id] || links[i % links.length] // Use assigned link or cycle through bulk links

        // Calculate staggered schedule time across 30 days
        const daysToSpread = 30
        const hoursPerDay = 24
        const totalHours = daysToSpread * hoursPerDay
        const hourInterval = totalHours / selectedPostArray.length
        
        const scheduleTime = new Date(baseScheduleTime.getTime() + (i * hourInterval * 60 * 60 * 1000))

        const response = await fetch("/api/pinterest/schedule", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            boardId: selectedBoardId,
            imageUrl: post.imageUrl,
            title: post.title,
            description: post.description,
            scheduledTime: scheduleTime.toISOString(),
            link: postLink.trim(),
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to schedule post ${post._id}`)
        }
      }

      toast({
        title: "Success",
        description: `Scheduled ${selectedPostArray.length} posts successfully.`,
      })

      // Clear selections and close dialog
      setSelectedPosts(new Set())
      setIsBulkShuffleOpen(false)
      setBulkLinks("")
      setBulkPostLinks({})
      setSelectedDate(undefined)
      setSelectedTime("")
      
      // Refresh posts list
      fetchPosts()
    } catch (error) {
      console.error("Error scheduling posts:", error)
      toast({
        title: "Error",
        description: "Failed to schedule some posts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsScheduling(false)
    }
  }

  const handlePublish = async (postId: string) => {
    const post = posts.find(p => p._id === postId)
    if (!post) return

    if (!post.imageUrl) {
      toast({
        title: "No Image",
        description: "Generate an image for this post before publishing.",
        variant: "destructive",
      })
      return
    }

    const boardId = selectedBoardForPosts[postId] || pinterestBoards[0]?.id
    if (!boardId) {
      toast({
        title: "No Board Selected",
        description: "Connect Pinterest and choose a board before publishing.",
        variant: "destructive",
      })
      return
    }

    const linkValue = postLinks[post._id] || post.defaultLink || ""
    if (!linkValue) {
      const proceed = confirm("This post doesn't have a link. Publish anyway?")
      if (!proceed) return
    }

    setIsPublishing(postId)
    try {
      // local limit check
      if(limits){
        if(limits.postsPublished.remaining===0){
          toast({
            title:limits.isPremium?"Daily Publishing Limit Reached":"Free Plan Limit Reached",
            description:`You can publish more posts in ${formatResetTime(new Date(limits.postsPublished.nextResetTime))}. ${!limits.isPremium?"Upgrade to Premium for higher limits!":"Upgrade to Enterprise for unlimited posts!"}`,
            variant:"destructive"
          });
          return;
        }
      }
      const response = await fetch("/api/pinterest/pins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          boardId,
          imageUrl: post.imageUrl,
          title: post.title,
          description: post.description,
          link: linkValue,
        }),
      })

      console.log('Publish response status',response.status);
      const resp = await response.json().catch(()=>({}));
      console.log('Publish response body',resp);
      if (!response.ok) {
        if (response.status === 403 && resp.details) {
          toast({
            title: resp.details.title,
            description: (
              <div className="space-y-2">
                <p>{resp.details.description}</p>
                {resp.details.action && (
                  <Link href="/pricing" className="text-white underline hover:text-blue-100 block">
                    {resp.details.action}
                  </Link>
                )}
              </div>
            ),
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: resp.error || "Failed to publish post. Please try again.",
            variant: "destructive",
          });
        }
        return;
      }

      toast({ title:"Published!" })

      // refresh limits
      fetchLimits();

      // Remove the published post from the list
      setPosts((prev) => prev.filter((p) => p._id !== postId))
      setSelectedPosts((prev) => {
        const next = new Set(prev)
        next.delete(postId)
        return next
      })
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

  const handleSchedule = (postId: string) => {
    const post = posts.find(p => p._id === postId)
    if (post) {
      setCurrentPostForScheduling(post)
      setScheduleDialogOpen(true)
    }
  }

  const handleScheduleSubmit = async () => {
    if (!selectedDate || !selectedTime || !currentPostForScheduling) return

    try {
      setIsScheduling(true)

      // Combine date and time
      const scheduledDateTime = new Date(selectedDate)
      const [hours, minutes] = selectedTime.split(":")
      scheduledDateTime.setHours(parseInt(hours), parseInt(minutes))

      // limit check
      if(limits){
        if(limits.postsScheduled.remaining===0){
          toast({
            title:limits.isPremium?"Daily Scheduling Limit Reached":"Free Plan Limit Reached",
            description:`You can schedule more posts in ${formatResetTime(new Date(limits.postsScheduled.nextResetTime))}. ${!limits.isPremium?"Upgrade to Premium for higher limits!":"Upgrade to Enterprise for unlimited posts!"}`,
            variant:"destructive"
          });
          return;
        }
      }

      const response = await fetch("/api/pinterest/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          boardId: selectedBoardForPosts[currentPostForScheduling._id] || pinterestBoards[0]?.id,
          imageUrl: currentPostForScheduling.imageUrl,
          title: currentPostForScheduling.title,
          description: currentPostForScheduling.description,
          scheduledTime: scheduledDateTime.toISOString(),
          link: postLinks[currentPostForScheduling._id] || currentPostForScheduling.defaultLink || "",
        }),
      })

      console.log('Schedule response status',response.status);
      const resp=await response.json().catch(()=>({}));
      console.log('Schedule response body',resp);
      if (!response.ok) {
        if(response.status===403 && resp.details){
           toast({title:resp.details.title,description:(<div className="space-y-2"><p>{resp.details.description}</p>{resp.details.action&&(<Link href="/pricing" className="text-white underline hover:text-blue-100 block">{resp.details.action}</Link>)}</div>),variant:"destructive"});
        }else{
           toast({title:"Error",description:resp.error||"Failed to schedule post.",variant:"destructive"});
        }
        return;
      }

      toast({title:"Post Scheduled"})

      // Reset form and close dialog
      setSelectedDate(undefined)
      setSelectedTime("")
      setScheduleDialogOpen(false)
      setCurrentPostForScheduling(null)

      // Refresh posts list
      fetchPosts()
    } catch (error) {
      console.error("Error scheduling post:", error)
      toast({
        title: "Error",
        description: "Failed to schedule post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsScheduling(false)
    }
  }

  const handleEditLink = (postId: string) => {
    const post = posts.find(p=>p._id === postId)
    if(!post) return
    setCurrentPostForLink(post)
    setLinkInput(post.defaultLink || "")
    setLinkDialogOpen(true)
  }

  const handleDelete = (postId: string) => {
    if(!confirm("Delete this post permanently?")) return
    fetch(`/api/posts/recentposts/${postId}`, {method:"DELETE"}).then(async res=>{
      if(!res.ok) throw new Error()
      setPosts(prev=>prev.filter(p=>p._id!==postId))
      toast({title:"Deleted"})
    }).catch(()=>{
      toast({title:"Error",description:"Unable to delete.",variant:"destructive"})
    })
  }

  const handleLinkSave = async ()=>{
    if(!currentPostForLink) return
    try{
      const res = await fetch(`/api/posts/recentposts/${currentPostForLink._id}`,{
        method:"PATCH",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({link:linkInput})
      })
      if(!res.ok) throw new Error()
      setPosts(prev=>prev.map(p=>p._id===currentPostForLink._id?{...p, defaultLink:linkInput}:p))
      toast({title:"Link updated"})
      setLinkDialogOpen(false)
    }catch{
      toast({title:"Error",description:"Failed to update link",variant:"destructive"})
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

  const handleDownloadCSV = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing Date / Time",
        description: "Please pick a publish date and time first.",
        variant: "destructive",
      })
      setCsvError("Please select both date and time before downloading CSV.")
      setMissingFields(["date", "time"])
      return
    }

    const eligiblePosts = posts.filter(p => (selectedPosts.size === 0 || selectedPosts.has(p._id)) && p.status !== "published" && p.status !== "scheduled")

    if (eligiblePosts.length === 0) {
      toast({
        title: "No Eligible Posts",
        description: "Selected posts are already scheduled, published.",
        variant: "destructive",
      })
      setCsvError("None of the selected posts are eligible (already scheduled, published or deleted).")
      return
    }

    // Combine base date+time
    const baseDateTime = new Date(selectedDate)
    const [h, m] = selectedTime.split(":")
    baseDateTime.setHours(parseInt(h), parseInt(m))

    const rows = eligiblePosts.map((post, idx) => {
      const scheduleDate = new Date(baseDateTime.getTime() + idx * 60 * 60 * 1000)
      return [
        post.title,
        post.description,
        post.imageUrl,
        bulkPostLinks[post._id] || postLinks[post._id] || post.defaultLink || "",
        scheduleDate.toISOString(),
      ]
    })

    const csvHeader = ["Title", "Description", "Image URL", "Link", "Scheduled At"]
    const csvString = buildCsv([csvHeader, ...rows])

    const blob = new Blob([csvString], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "bulk_schedule.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({ title:"CSV Downloaded", description:`${eligiblePosts.length} posts exported.` })
    setCsvError("")
  }

  const handleDeleteAll = async () => {
    if (!confirm("Delete all recent posts? This cannot be undone.")) return;
    try {
      setIsLoading(true)
      const response = await fetch("/api/posts/recentposts", { method: "DELETE" })
      if (!response.ok) throw new Error("Failed")
      toast({ title:"Deleted", description:"All recent posts have been removed." })
      setPosts([])
      setSelectedPosts(new Set())
    } catch(err){
      toast({ title:"Error", description:"Unable to delete posts." , variant:"destructive" })
    } finally { setIsLoading(false) }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Recent Posts</h1>
          <div className="flex gap-2">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mt-4"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2 mt-2"></div>
                <div className="aspect-[4/5] bg-gray-200 rounded animate-pulse my-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Determine storage notice
  const now = new Date()
  const isPremium = session?.user?.premiumUntil && new Date(session.user.premiumUntil) > now
  const storageHours = isPremium ? 24 : 2

  const StorageAlert = () => (
    <Alert variant={isPremium ? "default" : "warning"} className="mb-6 flex items-center gap-3">
      <AlertCircle className="h-5 w-5 text-[#FFAA2C]" />
      <div>
        <AlertTitle className="mb-0 font-semibold text-[#D97706]">Limited Storage Period</AlertTitle>
        <AlertDescription className="mt-0 text-[#4B5563]">
          {isPremium ? (
            <span>
              Your posts are stored for <strong>7&nbsp;days</strong>. Need longer?&nbsp;
              <Link href="/pricing" className="text-[#F97316] underline">Upgrade to Enterprise</Link> for unlimited storage.
            </span>
          ) : (
            <span className="text-[#F97316]">
              Your posts are stored for <strong>2&nbsp;hours</strong> only. &nbsp;
              <Link href="/pricing" className="underline">Upgrade to Premium</Link> for 7-day storage.
            </span>
          )}
        </AlertDescription>
      </div>
    </Alert>
  )

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Recent Posts</h1>
          <p className="text-muted-foreground mt-1">Manage your Pinterest posts and schedule new content</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleDeleteAll}
            className="relative bg-transparent"
          >
            Delete All
          </Button>
          {session?.user?.premiumUntil && new Date(session.user.premiumUntil) > new Date() ? (
            <Button onClick={handleBulkShuffleClick} variant="outline" className="relative bg-transparent">
              <Shuffle className="h-4 w-4 mr-2" /> Bulk Shuffle Schedule
            </Button>
          ) : (
            <div className="flex flex-col items-start">
              <Button onClick={handleBulkShuffleClick} variant="outline" className="relative bg-transparent cursor-not-allowed" disabled>
                <div className="flex items-center gap-2">
                  <Shuffle className="h-4 w-4" />
                  <span>Bulk Shuffle Schedule</span>
                  <div className="flex items-center gap-1 ml-2">
                    <Lock className="h-3 w-3 text-gray-400" />
                    <Crown className="h-3 w-3 text-yellow-500" />
                  </div>
                </div>
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                Unlock Bulk Shuffle with {" "}
                <Link href="/pricing" className="text-teal-600 hover:underline">Premium</Link> for unlimited storage.
              </p>
            </div>
          )}
          <Button asChild>
            <Link href="/dashboard/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Link>
          </Button>
        </div>
      </div>
      <StorageAlert />

      {posts.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first Pinterest post</p>
              <Button asChild>
                <Link href="/dashboard/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your New Post
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const boardId = selectedBoardForPosts[post._id] || pinterestBoards[0]?.id
            const boardName = pinterestBoards.find(b => b.id === boardId)?.name || "No board"
            
            return (
              <PostCard
                key={post._id}
                post={{
                  id: post._id,
                  title: post.title,
                  description: post.description,
                  imageUrl: post.imageUrl,
                  defaultLink: post.defaultLink,
                  status: post.status,
                  scheduledFor: post.scheduledFor,
                  publishedAt: post.publishedAt,
                  createdAt: post.createdAt,
                  metrics: post.metrics,
                }}
                boardName={boardName}
                customLink={postLinks[post._id]}
                isSelected={selectedPosts.has(post._id)}
                isPublishing={isPublishing === post._id}
                showCheckbox={true}
                onSelect={togglePostSelection}
                onPublish={handlePublish}
                onSchedule={handleSchedule}
                onEditLink={handleEditLink}
                onDelete={handleDelete}
                imageSize={post.imageSize || "9:16"}
              />
            )
          })}
        </div>
      )}

      {/* Bulk Shuffle Dialog */}
      <Dialog open={isBulkShuffleOpen} onOpenChange={setIsBulkShuffleOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Bulk Shuffle Schedule
              <div className="flex items-center gap-1 text-muted-foreground">
                <HelpCircle 
                  className="h-4 w-4 cursor-help" 
                  title="Posts will be automatically distributed across the next 30 days for optimal engagement. Each post gets a unique time slot to maximize reach."
                />
              </div>
            </DialogTitle>
            <DialogDescription>
              Schedule {eligibleCount} posts across the next 30 days with optimal timing distribution.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Post Preview Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Selected Posts ({eligibleCount})</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPostPreview(!showPostPreview)}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  {showPostPreview ? 'Hide' : 'Show'} Preview
                </Button>
              </div>
              
              {showPostPreview && (
                <div className="max-h-60 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                  <div className="space-y-3">
                    {posts.filter(p => 
                      selectedPosts.has(p._id) && 
                      p.status !== "published" && 
                      p.status !== "scheduled"
                    ).map((post, index) => (
                      <div key={post._id} className="bg-white p-3 rounded-lg border">
                        <div className="flex items-start gap-3">
                          {post.imageUrl && (
                            <img 
                              src={post.imageUrl} 
                              alt={post.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate" title={post.title}>
                              {post.title}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {post.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Input
                                placeholder="Post link (optional)"
                                value={bulkPostLinks[post._id] || ""}
                                onChange={(e) => setBulkPostLinks(prev => ({
                                  ...prev,
                                  [post._id]: e.target.value
                                }))}
                                className="text-xs h-7"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                title="Edit link"
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Pinterest Board</Label>
              <Select value={selectedBoardId} onValueChange={setSelectedBoardId}>
                <SelectTrigger className="w-full">
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
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Fallback Links (one per line)</Label>
                <HelpCircle 
                  className="h-4 w-4 text-muted-foreground cursor-help" 
                  title="These links will be used for posts that don't have individual links assigned. Links will be rotated among posts."
                />
              </div>
              <Textarea
                value={bulkLinks}
                onChange={(e) => setBulkLinks(e.target.value)}
                placeholder="Enter fallback links here, one per line..."
                className="h-24 resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Optional: These links will be used for posts without individual links assigned above.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <div className={missingFields.includes("date") ? "border border-red-500 rounded-md p-1" : ""}>
                  <DatePicker
                    date={selectedDate}
                    onDateChange={(d)=>{setSelectedDate(d);setMissingFields(f=>f.filter(x=>x!=="date"))}}
                    disabled={(date) => date < new Date()}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Start Time</Label>
                <div className={missingFields.includes("time") ? "border border-red-500 rounded-md p-1" : ""}>
                  <TimeSelect
                    value={selectedTime}
                    onValueChange={(t)=>{setSelectedTime(t);setMissingFields(f=>f.filter(x=>x!=="time"))}}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <HelpCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Scheduling Logic:</p>
                  <p className="mt-1">Posts will be distributed evenly across 30 days starting from your selected date and time. This ensures optimal engagement by avoiding posting conflicts and maximizing reach.</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsBulkShuffleOpen(false)}>
              Cancel
            </Button>
            <div className="flex flex-col flex-1">
              {csvError && <p className="text-xs text-red-600 mb-1">{csvError}</p>}
              {selectedDate && selectedTime && (
                <Button
                  variant="secondary"
                  onClick={handleDownloadCSV}
                  className="mr-auto"
                >
                  Download CSV
                </Button>
              )}
            </div>
            <Button onClick={handleBulkSchedule} disabled={isScheduling || !selectedBoardId}>
              {isScheduling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                `Schedule ${eligibleCount} Posts`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[400px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule Post</DialogTitle>
            <DialogDescription>
              Choose when to publish this post
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <DatePicker
                date={selectedDate}
                onDateChange={setSelectedDate}
                disabled={(date) => date < new Date()}
              />
            </div>

            <div className="space-y-2">
              <Label>Time</Label>
              <TimeSelect
                value={selectedTime}
                onValueChange={setSelectedTime}
                className="w-full"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleScheduleSubmit}
              disabled={!selectedDate || !selectedTime || isScheduling}
            >
              {isScheduling ? (
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

      {/* Link Edit Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
          </DialogHeader>
          <Input value={linkInput} onChange={e=>setLinkInput(e.target.value)} placeholder="https://..." />
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={()=>setLinkDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleLinkSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  )
}
