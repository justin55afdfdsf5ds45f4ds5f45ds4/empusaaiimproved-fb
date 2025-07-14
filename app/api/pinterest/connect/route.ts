import { NextResponse, NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { logDebug } from "@/lib/logger"

export async function POST(req: NextRequest) {
  try {
    logDebug("PinterestConnect", { step: "init" })
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Generate a random state for CSRF protection
    const state = Math.random().toString(36).substring(2, 15)
    logDebug("PinterestConnect", { step: "generate_state", state })

    // Determine redirect URI:
    // 1) Use explicit env var if provided (for prod)
    // 2) Otherwise build from the request's origin (handles localhost and dynamic ports)

    const envRedirect = process.env.PINTEREST_REDIRECT_URI

    const originHeader = req.headers.get("origin") || undefined

    const isLocalhost = originHeader ? originHeader.includes("localhost") : false

    const baseUrlFallback = originHeader ||
      (process.env.NEXT_PUBLIC_BASE_URL
        ? process.env.NEXT_PUBLIC_BASE_URL
        : process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000")

    const redirectUri = isLocalhost
      ? `${originHeader}/api/auth/callback/pinterest`
      : envRedirect || `${baseUrlFallback}/api/auth/callback/pinterest`

    const baseUrl = baseUrlFallback // keep for logs
    logDebug("PinterestConnect", { step: "build_redirect_uri", envRedirect, originHeader, isLocalhost, baseUrl, redirectUri })

    const response = await NextResponse.json({
      url: `https://www.pinterest.com/oauth/?client_id=${process.env.AUTH_PINTEREST_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=user_accounts:read,boards:read,boards:write,pins:read,pins:write,analytics:read,ads:read&state=${state}`,
    })

    logDebug("PinterestConnect", { step: "send_response", pinterestOauthUrl: response.body ? undefined : "generated" })

    // Set cookie with state for 10 minutes
    response.cookies.set("pinterest_oauth_state", state, {
      maxAge: 600,
      path: "/",
      httpOnly: true,
      secure: envRedirect ? true : false,
      sameSite: "lax",
    })

    return response
  } catch (error) {
    logDebug("PinterestConnect", { step: "error", error: (error as Error).message })
    console.error("Pinterest connect error:", error)
    return NextResponse.json({ error: "Failed to initiate Pinterest connection" }, { status: 500 })
  }
}
