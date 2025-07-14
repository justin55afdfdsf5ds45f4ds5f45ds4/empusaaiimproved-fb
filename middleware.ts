import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.AUTH_SECRET })
    const { pathname } = request.nextUrl

    // Redirect unauthenticated users trying to access protected routes
    if (pathname.startsWith("/dashboard")) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", request.url))
      }
    }

    // Redirect authenticated users away from auth pages
    if ((pathname === "/login" || pathname === "/signup-free-trial" || pathname === "/signup" ) && token) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
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
    "/signup-free-trial",
  ],
}
