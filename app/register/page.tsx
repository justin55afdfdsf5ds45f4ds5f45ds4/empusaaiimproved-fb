"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      setIsLoading(false)

      if (!res.ok) {
        const { error } = await res.json()
        toast({ title: "Registration failed", description: error, variant: "destructive" })
        return
      }

      toast({ title: "Account created 🎉", description: "You can now log in with your credentials" })
      router.push("/login")
    } catch (error) {
      setIsLoading(false)
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 rounded-lg border bg-white p-6 shadow-md">
        <h1 className="text-center text-2xl font-bold">Create your Empusa AI account</h1>

        {["name", "email", "password"].map((field) => (
          <div key={field} className="space-y-2">
            <Label htmlFor={field} className="capitalize">
              {field}
            </Label>
            <Input
              id={field}
              type={field === "password" ? "password" : "text"}
              value={form[field as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              required
            />
          </div>
        ))}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign up"}
        </Button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-teal-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </main>
  )
}
