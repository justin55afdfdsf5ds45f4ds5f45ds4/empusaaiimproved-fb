import type { ReactNode } from "react"
// import { redirect } from "next/navigation"
// import { getServerSession } from "next-auth/next"
// import { authOptions } from "../api/auth/[...nextauth]/route"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { MobileNav } from "@/components/dashboard/mobile-nav"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // Temporarily bypass authentication
  // const session = await getServerSession(authOptions)
  // if (!session) {
  //   redirect("/login")
  // }

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
            <MobileNav />
          </div>
          <div className="flex items-center gap-4">
            <UserNav user={mockUser} />
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <DashboardNav />
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
