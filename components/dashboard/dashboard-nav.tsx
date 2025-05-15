"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, History, Settings, PlusCircle, Share2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Create Post",
    href: "/dashboard/create",
    icon: PlusCircle,
  },
  {
    title: "Recent Posts",
    href: "/dashboard/posts",
    icon: History,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Social Connections",
    href: "/dashboard/settings/social",
    icon: Share2,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:block w-64 border-r bg-white p-6">
      <div className="space-y-4">
        <div className="py-2">
          <h2 className="text-lg font-semibold tracking-tight">Navigation</h2>
        </div>
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === item.href ? "bg-teal-50 text-teal-700 hover:bg-teal-100 hover:text-teal-900" : "",
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
