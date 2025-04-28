"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <span className="sr-only">Toggle menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col gap-6 px-2 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
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
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <nav className="flex flex-col gap-4">
            <div>
              <button className="flex w-full items-center justify-between py-2 text-lg font-medium">
                Product
                <ChevronDown className="h-5 w-5" />
              </button>
              <div className="pl-4 pt-2">
                <Link href="#" className="block py-2 text-gray-500">
                  Empusa AI
                </Link>
                <Link href="#" className="block py-2 text-gray-500">
                  Empusa for Teams
                </Link>
              </div>
            </div>
            <div>
              <button className="flex w-full items-center justify-between py-2 text-lg font-medium">
                Solutions
                <ChevronDown className="h-5 w-5" />
              </button>
              <div className="pl-4 pt-2">
                <Link href="#" className="block py-2 text-gray-500">
                  Marketing
                </Link>
                <Link href="#" className="block py-2 text-gray-500">
                  Sales
                </Link>
                <Link href="#" className="block py-2 text-gray-500">
                  Customer Support
                </Link>
              </div>
            </div>
            <Link href="#pricing" className="py-2 text-lg font-medium" onClick={() => setOpen(false)}>
              Pricing
            </Link>
            <div>
              <button className="flex w-full items-center justify-between py-2 text-lg font-medium">
                Resources
                <ChevronDown className="h-5 w-5" />
              </button>
              <div className="pl-4 pt-2">
                <Link href="#" className="block py-2 text-gray-500">
                  Blog
                </Link>
                <Link href="#" className="block py-2 text-gray-500">
                  Help Center
                </Link>
                <Link href="#" className="block py-2 text-gray-500">
                  Webinars
                </Link>
              </div>
            </div>
          </nav>
          <div className="flex flex-col gap-2 pt-4">
            <Link href="/login" className="w-full">
              <Button variant="outline" className="w-full">
                Log in
              </Button>
            </Link>
            <Link href="https://calendly.com/fk146543/30min" target="_blank" className="w-full">
              <Button className="w-full bg-teal-600 hover:bg-teal-700">Get a demo</Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
