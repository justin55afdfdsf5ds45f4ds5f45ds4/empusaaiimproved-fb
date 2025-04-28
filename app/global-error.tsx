"use client"

import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
          <div className="max-w-md space-y-4">
            <h1 className="text-3xl font-bold">Something went wrong!</h1>
            <p className="text-gray-500">We apologize for the inconvenience. An unexpected error has occurred.</p>
            <div className="pt-4">
              <Button onClick={() => reset()}>Try again</Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
