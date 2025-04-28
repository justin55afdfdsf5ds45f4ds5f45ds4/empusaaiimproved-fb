import type { ReactNode } from "react"
import Link from "next/link"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { PinterestAuthCheck } from "@/components/pinterest-auth-check"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // Mock session data for demonstration
  const mockUser = {
    name: "Demo User",
    email: "demo@example.com",
    image: "/vibrant-street-market.png",
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-teal-600 flex items-center justify-center text-white font-bold text-lg">
                E
              </div>
              <div className="h-8 w-8 rounded-md bg-orange-400 flex items-center justify-center text-white font-bold text-lg ml-[-4px]">
                A
              </div>
              <span className="ml-2 font-bold text-xl">Empusa AI</span>
            </div>
            <nav className="hidden md:flex gap-6">
              <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/dashboard/create" className="text-sm font-medium text-gray-900">
                Create
              </Link>
              <Link href="/dashboard/posts" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                My Posts
              </Link>
              <Link href="/dashboard/settings" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                Settings
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <UserNav user={mockUser} />
          </div>
        </div>
      </header>
      <PinterestAuthCheck>
        <div className="flex flex-1">
          <aside className="hidden md:block w-64 border-r bg-white p-6">
            <DashboardNav />
          </aside>
          <main className="flex-1 p-6 bg-gray-50">{children}</main>
        </div>
      </PinterestAuthCheck>
    </div>
  )
}
