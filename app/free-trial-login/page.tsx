"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { signIn } from "next-auth/react"

export default function FreeTrialLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })
      if (res?.ok) {
        toast({
          title: "Login successful!",
          description: "Welcome back to your free trial account.",
        })
        router.replace("/dashboard")
      } else {
        setError("Invalid email or password.")
      }
    } catch (err) {
      setError("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full border-b bg-white shadow-sm py-4">
        <div className="container flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-teal-600 flex items-center justify-center text-white font-bold text-lg">
                E
              </div>
              <div className="h-8 w-8 rounded-md bg-orange-400 flex items-center justify-center text-white font-bold text-lg ml-[-4px]">
                A
              </div>
              <span className="ml-2 font-bold text-xl">Empusa AI</span>
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Log in to your free trial</h1>
            <p className="text-gray-500 mt-2">Access your 100 free post credits</p>
          </div>

          <Separator className="my-6">
            <span className="mx-2 text-xs text-gray-400">LOGIN</span>
          </Separator>

          {error && <div className="mb-4 text-red-500 text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Don&apos;t have a free trial account?{" "}
              <Link
                href="/free-trial-signup"
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full py-4 bg-white border-t">
        <div className="container text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Empusa AI. All rights reserved.
        </div>
      </footer>
      <Toaster />
    </div>
  )
}
