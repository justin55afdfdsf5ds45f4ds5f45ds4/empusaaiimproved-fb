import type { ReactNode } from "react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
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
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <div className="hidden md:block w-64 border-r bg-white p-6">
          <nav className="space-y-2">
            <a
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100"
            >
              Dashboard
            </a>
            <a
              href="/dashboard/create"
              className="flex items-center gap-2 rounded-lg px-3 py-2 bg-gray-100 text-gray-900 font-medium"
            >
              Create Posts
            </a>
            <a
              href="/dashboard/posts"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100"
            >
              My Posts
            </a>
            <a
              href="/dashboard/settings"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100"
            >
              Settings
            </a>
          </nav>
        </div>
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
