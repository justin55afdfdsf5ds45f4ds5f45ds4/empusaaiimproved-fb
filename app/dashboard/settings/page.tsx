"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

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

      <Tabs defaultValue="account">
        <TabsList className="mb-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="pinterest">Pinterest</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
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
                <Input id="name" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Your email" />
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
      </Tabs>
    </div>
  )
}
