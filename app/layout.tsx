import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import AuthProvider from "@/components/providers/session-provider"
import { CustomCursor } from "@/components/custom-cursor"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Empusa AI - Pinterest Content Automation",
  description: "Automatically create and publish SEO-optimized Pinterest content from any URL",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <AuthProvider>
          <CustomCursor />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
