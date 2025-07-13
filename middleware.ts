import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  try {
    // Retrieve the NextAuth token (if it exists)
    const token = await getToken({ req: request, secret: process.env.AUTH_SECRET })

    const { pathname } = request.nextUrl

    // If user is not authenticated and is trying to access a protected route, redirect to /login
    if (pathname.startsWith("/dashboard")) {
      if (!token) {
        const loginUrl = new URL("/login", request.url)
        return NextResponse.redirect(loginUrl)
      }
    }

    // If the user is authenticated and trying to access the login page, redirect to dashboard
    if (pathname === "/login" && token) {
      const dashboardUrl = new URL("/dashboard", request.url)
      return NextResponse.redirect(dashboardUrl)
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
  ],
}

