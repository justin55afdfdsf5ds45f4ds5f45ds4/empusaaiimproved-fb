"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle, PinIcon } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function SocialSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isConnecting, setIsConnecting] = useState(false)
  const [pinterestStatus, setPinterestStatus] = useState<"connected" | "disconnected" | "loading">("loading")
  const [pinterestProfile, setPinterestProfile] = useState<any>(null)

  // Check for success or error messages from the callback
  const success = searchParams.get("success")
  const error = searchParams.get("error")

  useEffect(() => {
    if (success) {
      toast({
        title: "Pinterest Connected",
        description: "Your Pinterest account has been successfully connected.",
      })
    } else if (error) {
      toast({
        title: "Connection Failed",
        description: `Failed to connect Pinterest account: ${error}`,
        variant: "destructive",
      })
    }
  }, [success, error])

  // Check if the user has a connected Pinterest account
  useEffect(() => {
    async function checkPinterestConnection() {
      try {
        const response = await fetch("/api/pinterest/status")
        const data = await response.json()

        if (data.connected) {
          setPinterestStatus("connected")
          setPinterestProfile(data.profile || null)
        } else {
          setPinterestStatus("disconnected")
        }
      } catch (error) {
        console.error("Error checking Pinterest connection:", error)
        setPinterestStatus("disconnected")
      }
    }

    if (status === "authenticated") {
      checkPinterestConnection()
    } else if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard/settings/social")
    }
  }, [status, router])

  const handleConnectPinterest = async () => {
    setIsConnecting(true)
    try {
      const response = await fetch("/api/pinterest/connect", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to initiate Pinterest connection")
      }

      const data = await response.json()
      window.location.href = data.url
    } catch (error) {
      console.error("Error connecting Pinterest:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to initiate Pinterest connection. Please try again.",
        variant: "destructive",
      })
      setIsConnecting(false)
    }
  }

  const handleDisconnectPinterest = async () => {
    try {
      const response = await fetch("/api/pinterest/disconnect", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to disconnect Pinterest account")
      }

      setPinterestStatus("disconnected")
      setPinterestProfile(null)
      toast({
        title: "Pinterest Disconnected",
        description: "Your Pinterest account has been disconnected.",
      })
    } catch (error) {
      console.error("Error disconnecting Pinterest:", error)
      toast({
        title: "Disconnection Failed",
        description: "Failed to disconnect Pinterest account. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (status === "loading" || pinterestStatus === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Social Connections</h1>

      {(success || error) && (
        <Alert variant={success ? "default" : "destructive"} className="mb-6">
          {success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{success ? "Connection Successful" : "Connection Failed"}</AlertTitle>
          <AlertDescription>
            {success
              ? "Your Pinterest account has been successfully connected."
              : `Failed to connect Pinterest account: ${error}`}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PinIcon className="h-5 w-5 text-red-600" />
            Pinterest
          </CardTitle>
          <CardDescription>
            Connect your Pinterest account to create and publish pins directly from Empusa AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pinterestStatus === "connected" && pinterestProfile && (
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-md">
              {pinterestProfile.profile_image ? (
                <img
                  src={pinterestProfile.profile_image || "/placeholder.svg"}
                  alt={pinterestProfile.username}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <PinIcon className="h-6 w-6 text-red-600" />
                </div>
              )}
              <div>
                <p className="font-medium">{pinterestProfile.username}</p>
                <p className="text-sm text-gray-500">Connected</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {pinterestStatus === "connected" ? (
            <Button variant="outline" onClick={handleDisconnectPinterest}>
              Disconnect Pinterest
            </Button>
          ) : (
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleConnectPinterest} disabled={isConnecting}>
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <PinIcon className="mr-2 h-4 w-4" />
                  Connect Pinterest
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
