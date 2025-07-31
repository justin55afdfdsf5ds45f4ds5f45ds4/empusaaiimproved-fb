import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { from, to } = body

    if (!from || !to) {
      return NextResponse.json({ error: "Both 'from' and 'to' dates are required." }, { status: 400 })
    }

    const fromDate = new Date(from)
    const toDate = new Date(to)

    // Count posts created within the date range using Supabase
    const { count: totalPosts } = await supabaseAdmin
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('userId', session.user.id)
      .gte('createdAt', fromDate.toISOString())
      .lte('createdAt', toDate.toISOString())

    // Count scheduled posts within the date range using Supabase
    const { count: scheduledPosts } = await supabaseAdmin
      .from('scheduled_posts')
      .select('*', { count: 'exact', head: true })
      .eq('userId', session.user.id)
      .eq('isPublished', false)
      .gte('createdAt', fromDate.toISOString())
      .lte('createdAt', toDate.toISOString())

    const pinterest_fromDate = new Date(fromDate).toISOString().split("T")[0];
    const pinterest_toDate = new Date(toDate).toISOString().split("T")[0]

    const analyticsUrl = `https://api.pinterest.com/v5/user_account/analytics?start_date=${pinterest_fromDate}&end_date=${pinterest_toDate}`
    
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('pinterest_access_token')
      .eq('email', session.user.email)
      .single()

    if (!user || !user.pinterest_access_token) {
      return NextResponse.json({ error: "Pinterest account not connected" }, { status: 400 })
    }

    const response = await fetch(analyticsUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user.pinterest_access_token}`,
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    console.log(data.all.summary_metrics.ENGAGEMENT_RATE * 100)
    // Placeholder for engagement (you can update later if available)
    const totalEngagement = data.all.summary_metrics.ENGAGEMENT_RATE * 100

    return NextResponse.json({
      totalPosts: totalPosts || 0,
      scheduledPosts: scheduledPosts || 0,
      totalEngagement,
    })
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error)
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
  }
}
