"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, User, UploadCloud } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function ProfileSettingsPage() {
  const { toast } = useToast()
  const { data: session, status, update } = useSession()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null)
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "")
      setEmail(session.user.email || "")
    }
  }, [session])

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfilePictureFile(file)
      setProfilePicturePreview(URL.createObjectURL(file))
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      })
    }

    try {
      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.log(errorData)
        throw new Error(errorData.error)
      }

      setCurrentPassword("")
      setConfirmPassword("")
      setNewPassword("")

      toast({
        title: "Password Changed",
        description: "Your password has been changed successfully.",
      })
    } catch (error: any) {
      // console.error("Error changing password:", error);
      console.log(error.message)
      toast({
        title: "Error",
        description: error.message || "Failed to change password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    let imageUrl = session?.user?.image || ""

    if (profilePictureFile) {
      setIsUploading(true)
      const formData = new FormData()
      formData.append("file", profilePictureFile)
      // Assuming you have a 'preset' for unsigned uploads in Cloudinary or will use a signed upload
      // For simplicity, using a generic upload endpoint. Adapt if using signed uploads.
      // formData.append("upload_preset", "your_cloudinary_preset"); // Example for unsigned

      try {
        const uploadResponse = await fetch("/api/cloudinary/upload", {
          // Your existing Cloudinary upload API
          method: "POST",
          body: formData,
        })

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json()
          throw new Error(errorData.error || "Failed to upload image")
        }
        const uploadedImageData = await uploadResponse.json()
        imageUrl = uploadedImageData.secure_url // Or whatever your API returns
      } catch (error: any) {
        toast({
          title: "Image Upload Failed",
          description: error.message || "Could not upload profile picture.",
          variant: "destructive",
        })
        setIsUploading(false)
        setIsLoading(false)
        return
      }
      setIsUploading(false)
    }

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          image: imageUrl, // Send the new image URL
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update profile")
      }

      // Update the session
      await update({
        // This is NextAuth's update function
        name,
        email,
        image: imageUrl,
      })

      setProfilePictureFile(null) // Clear file after successful upload
      // setProfilePicturePreview(null); // Keep preview or update with session.user.image

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal information and email address.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Profile Picture</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={profilePicturePreview || session?.user?.image || ""}
                      alt={session?.user?.name || "User"}
                    />
                    <AvatarFallback className="bg-teal-100 text-teal-800">
                      <User className="h-10 w-10" />
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("profile-picture-upload")?.click()}
                    disabled={isUploading}
                  >
                    <UploadCloud className="mr-2 h-4 w-4" />
                    {isUploading ? "Uploading..." : "Change Picture"}
                  </Button>
                  <input
                    id="profile-picture-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                  />
                </div>
                {profilePicturePreview && (
                  <p className="text-xs text-gray-500">New picture selected. Save changes to apply.</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Update your password to keep your account secure.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="Enter your current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} variant="outline" onClick={handleChangePassword}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Changing...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
