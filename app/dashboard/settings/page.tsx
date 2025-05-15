import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Share2, Shield, Bell } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/settings/profile">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-teal-600" />
                Profile
              </CardTitle>
              <CardDescription>Manage your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Update your name, email, password, and profile picture.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Edit Profile
              </Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/dashboard/settings/social">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-teal-600" />
                Social Connections
              </CardTitle>
              <CardDescription>Connect your social media accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Connect your Pinterest account to publish content directly.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Manage Connections
              </Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/dashboard/settings/notifications">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-teal-600" />
                Notifications
              </CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Manage email notifications and in-app alerts.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Notification Settings
              </Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/dashboard/settings/security">
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-teal-600" />
                Security
              </CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Update your password, enable two-factor authentication, and manage sessions.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Security Settings
              </Button>
            </CardFooter>
          </Card>
        </Link>
      </div>
    </div>
  )
}
