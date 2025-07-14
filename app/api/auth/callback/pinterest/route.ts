import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../[...nextauth]/route"
import clientPromise from "@/lib/mongodb"
import { logDebug } from "@/lib/logger"

// Ensure this route runs in a Node.js runtime (not Edge) because it uses Buffer and external network calls
export const runtime = "nodejs"
// Disable any static optimization attempts
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    logDebug("PinterestCallback", { step: "init", url: req.url })
    // Get the code and state from the query parameters
    const url = new URL(req.url)
    const code = url.searchParams.get("code")
    const state = url.searchParams.get("state")

    // Check if code and state are present
    if (!code || !state) {
      logDebug("PinterestCallback", { step: "missing_params", code, state })
      return NextResponse.redirect(new URL("/dashboard/settings/social?error=missing_params", req.url))
    }

    // Get the state from the cookie
    const storedState = req.cookies.get("pinterest_oauth_state")?.value
    if (!storedState || storedState !== state) {
      logDebug("PinterestCallback", { step: "invalid_state", storedState, state })
      return NextResponse.redirect(new URL("/dashboard/settings/social?error=invalid_state", req.url))
    }

    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    logDebug("PinterestCallback", { step: "session_check", authenticated: !!session?.user })
    if (!session || !session.user) {
      return NextResponse.redirect(new URL("/login?callbackUrl=/settings/social", req.url))
    }

    // Exchange the code for an access token
    // const tokenResponse = await fetch("https://api.pinterest.com/v5/oauth/token", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   },
    //   body: new URLSearchParams({
    //     grant_type: "authorization_code",
    //     code,
    //     redirect_uri: process.env.PINTEREST_REDIRECT_URI || "",
    //     client_id: process.env.AUTH_PINTEREST_ID || "",
    //     client_secret: process.env.AUTH_PINTEREST_SECRET || "",
    //   }),
    // })

    const tokenResponse = await fetch("https://api.pinterest.com/v5/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(`${process.env.AUTH_PINTEREST_ID}:${process.env.AUTH_PINTEREST_SECRET}`).toString("base64"),
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: process.env.PINTEREST_REDIRECT_URI!,
        }),
      })

    if (!tokenResponse.ok) {
      logDebug("PinterestCallback", { step: "token_exchange_failed", status: tokenResponse.status })
      const errorData = await tokenResponse.text()
      console.error("Pinterest token exchange error:", errorData)
      return NextResponse.redirect(new URL("/dashboard/settings/social?error=token_exchange", req.url))
    }

    const tokenData = await tokenResponse.json()
    const { access_token, refresh_token, expires_in } = tokenData
    logDebug("PinterestCallback", { step: "token_received", expires_in })

    // Get the user's Pinterest profile
    const profileResponse = await fetch("https://api.pinterest.com/v5/user_account", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    if (!profileResponse.ok) {
      logDebug("PinterestCallback", { step: "profile_fetch_failed", status: profileResponse.status })
      console.error("Pinterest profile fetch error:", await profileResponse.text())
      return NextResponse.redirect(new URL("/dashboard/settings/social?error=profile_fetch", req.url))
    }

    const profileData = await profileResponse.json()
    logDebug("PinterestCallback", { step: "profile_received", username: profileData?.username || profileData?.id })
    const pinterestUserId = profileData.username || profileData.id

    // Store the tokens in the database
    const client = await clientPromise
    const db = client.db()

    await db.collection("users").updateOne(
      { email: session.user.email },
      {
        $set: {
          pinterest: {
            userId: pinterestUserId,
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresAt: new Date(Date.now() + expires_in * 1000),
            profile: profileData,
          },
          email: session.user.email,
        },
      },
      { upsert: true },
    )
    logDebug("PinterestCallback", { step: "tokens_saved", upsert: true })

    // Clear the state cookie
    const response = NextResponse.redirect(new URL("/dashboard/settings/social?success=true", req.url))
    logDebug("PinterestCallback", { step: "success", redirect: "/dashboard/settings/social?success=true" })
    response.cookies.delete("pinterest_oauth_state")

    return response
  } catch (error) {
    logDebug("PinterestCallback", { step: "error", error: (error as Error).message })
    console.error("Pinterest callback error:", error)
    return NextResponse.redirect(new URL("/dashboard/settings/social?error=server_error", req.url))
  }
}
