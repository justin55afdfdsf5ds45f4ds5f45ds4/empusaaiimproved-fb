"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open menu</span>
      </Button>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
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
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-6 w-6" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <div className="flex-1 overflow-auto py-4">
              <nav className="flex flex-col space-y-4 px-4">
                <Link
                  href="#features"
                  className="text-lg font-medium hover:text-teal-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Features
                </Link>
                <Link
                  href="#pricing"
                  className="text-lg font-medium hover:text-teal-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  href="/blog"
                  className="text-lg font-medium hover:text-teal-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Blog
                </Link>
                <Link
                  href="/about"
                  className="text-lg font-medium hover:text-teal-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
                <div className="border-t my-4"></div>
                <Link
                  href="/login"
                  className="text-lg font-medium hover:text-teal-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Log in
                </Link>
                <Link href="/signup" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-teal-600 hover:bg-teal-700">Sign up</Button>
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
