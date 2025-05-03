"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn, useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/dashboard")
    }
  }, [session, status, router])

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Login successful",
          description: "Welcome back to Empusa AI!",
        })
        router.push("/dashboard")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error("Google sign-in error:", error)
      toast({
        title: "Authentication Error",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      })
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
            <h1 className="text-2xl font-bold">Log in to Empusa AI</h1>
            <p className="text-gray-500 mt-2">Welcome back! Log in to your account</p>
          </div>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 mb-6"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Continue with Google
          </Button>

          <Separator className="my-6">
            <span className="mx-2 text-xs text-gray-400">OR</span>
          </Separator>

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

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="remember" className="rounded border-gray-300" />
                <label htmlFor="remember" className="text-sm text-gray-500">
                  Remember me
                </label>
              </div>
              <Link href="/forgot-password" className="text-sm text-teal-600 hover:text-teal-700">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link href="/signup" className="text-teal-600 hover:text-teal-700 font-medium">
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
    </div>
  )
}
