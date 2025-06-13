import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Check if the path is /login
  if (path === "/login") {
    // Get the purchase status from cookies
    const hasPurchased = request.cookies.get("purchase_completed")

    // If no purchase cookie is found, redirect to home page
    if (!hasPurchased) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // Redirect /register to /login
  if (path === "/register") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ["/login", "/register"],
}
