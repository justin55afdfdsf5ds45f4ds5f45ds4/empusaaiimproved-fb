"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { BellRing, CreditCard, Key, PinIcon as PinterestIcon, User } from "lucide-react"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [isPinterestConnecting, setIsPinterestConnecting] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully.",
    })
  }

  const handleConnectPinterest = async () => {
    setIsPinterestConnecting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsPinterestConnecting(false)
    toast({
      title: "Pinterest Connected",
      description: "Your Pinterest account has been connected successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500 mt-2">Manage your account settings and Pinterest integration.</p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="mb-4 grid grid-cols-4 md:grid-cols-5">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="pinterest" className="flex items-center gap-2">
            <PinterestIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Pinterest</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <BellRing className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">API</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your account details and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" defaultValue="Demo User" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Your email" defaultValue="demo@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles" selected>
                    Pacific Time (PT)
                  </option>
                </select>
              </div>
              <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pinterest">
          <Card>
            <CardHeader>
              <CardTitle>Pinterest Integration</CardTitle>
              <CardDescription>Connect your Pinterest account to enable automatic publishing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Pinterest Account</p>
                    <p className="text-sm text-gray-500">Not connected</p>
                  </div>
                  <Button
                    className="bg-teal-600 hover:bg-teal-700"
                    onClick={handleConnectPinterest}
                    disabled={isPinterestConnecting}
                  >
                    {isPinterestConnecting ? "Connecting..." : "Connect Account"}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="default-board">Default Board</Label>
                <Input id="default-board" placeholder="Select a board" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pin-description-template">Default Pin Description Template</Label>
                <Input
                  id="pin-description-template"
                  placeholder="Enter a template for your pin descriptions"
                  disabled
                />
                <p className="text-xs text-gray-500">
                  Use {"{title}"} and {"{url}"} as placeholders for dynamic content.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you want to receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive updates via email</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Post Published Notifications</p>
                  <p className="text-sm text-gray-500">Get notified when posts are published</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing Updates</p>
                  <p className="text-sm text-gray-500">Receive marketing and promotional emails</p>
                </div>
                <Switch />
              </div>
              <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>Manage your API keys and access tokens.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex gap-2">
                  <Input id="api-key" value="••••••••••••••••••••••••••••••" readOnly className="flex-1" />
                  <Button variant="outline">Copy</Button>
                  <Button variant="outline">Regenerate</Button>
                </div>
                <p className="text-xs text-gray-500">
                  Your API key provides access to our API. Keep it secure and never share it publicly.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input id="webhook-url" placeholder="https://your-app.com/webhook" />
                <p className="text-xs text-gray-500">
                  Receive real-time notifications when pins are published or scheduled.
                </p>
              </div>
              <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Manage your subscription and payment methods.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-gray-50 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium">Current Plan</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-teal-600">Pro Plan</Badge>
                      <span className="text-sm text-gray-500">$49/month</span>
                    </div>
                  </div>
                  <Button variant="outline">Upgrade Plan</Button>
                </div>
                <div className="text-sm text-gray-500">
                  <p>Next billing date: January 1, 2024</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="rounded-lg border p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-xs text-gray-500">Expires 12/2025</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Billing Address</Label>
                <div className="rounded-lg border p-3">
                  <p className="text-sm">123 Main Street</p>
                  <p className="text-sm">San Francisco, CA 94105</p>
                  <p className="text-sm">United States</p>
                  <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto">
                    Edit Address
                  </Button>
                </div>
              </div>

              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  View Billing History
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
