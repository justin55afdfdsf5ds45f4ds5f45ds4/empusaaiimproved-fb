"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PinIcon } from "lucide-react"

export function PinterestFallback() {
  const handleConnectPinterest = () => {
    window.location.href = "/api/auth/signin/pinterest?callbackUrl=/dashboard"
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connect Pinterest</CardTitle>
        <CardDescription>Connect your Pinterest account to create and publish content</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center p-6 border rounded-md bg-gray-50">
          <PinIcon className="h-12 w-12 text-red-600 mb-4" />
          <p className="text-center text-gray-600 mb-4">
            To use all features of Empusa AI, please connect your Pinterest account.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleConnectPinterest} className="w-full bg-red-600 hover:bg-red-700">
          <PinIcon className="mr-2 h-4 w-4" />
          Connect Pinterest Account
        </Button>
      </CardFooter>
    </Card>
  )
}
