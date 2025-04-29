"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { PinIcon, Loader2 } from "lucide-react"

export function PinterestStatus() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex items-center space-x-2 text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Checking Pinterest status...</span>
      </div>
    )
  }

  const hasPinterest = session?.user?.accounts?.some((account) => account.provider === "pinterest")

  if (!hasPinterest) {
    return (
      <Button
        size="sm"
        variant="outline"
        className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
        onClick={() => signIn("pinterest", { callbackUrl: "/dashboard" })}
      >
        <PinIcon className="mr-2 h-4 w-4" />
        Connect Pinterest
      </Button>
    )
  }

  return (
    <div className="flex items-center space-x-2 text-green-600">
      <PinIcon className="h-4 w-4" />
      <span>Pinterest Connected</span>
    </div>
  )
}
