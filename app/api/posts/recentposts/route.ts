import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { deleteImage } from "@/lib/cloudinary1"

async function fetchRecent(session:any){
  if(!session?.user?.id){
    return NextResponse.json({posts:[]})
  }
  const client = await clientPromise
  const db = client.db()
  const postsCollection = db.collection("posts")

  const now = new Date()
  const isPremium = session.user.premiumUntil && new Date(session.user.premiumUntil) > now
  const expiryHours = isPremium ? 168 : 2 // 7 days for premium, 2 hours for free
  const expireBefore = new Date(now.getTime() - expiryHours*60*60*1000)

  // Delete posts older than expiry window
  const oldPosts = await postsCollection.find({userId:session.user.id, createdAt:{$lt:expireBefore}}).toArray()
  await Promise.all(oldPosts.map(async (p:any)=>{
    if(p.cloudinaryPublicId){
      try{ await deleteImage(p.cloudinaryPublicId) }catch{}
    }
  }))
  if(oldPosts.length) await postsCollection.deleteMany({_id:{$in:oldPosts.map(p=>p._id)}})

  const recentPosts = await postsCollection.find({userId:session.user.id, createdAt:{$gte:expireBefore}}).sort({createdAt:-1}).toArray()
  return NextResponse.json({posts:recentPosts})
}

export async function GET(){
  const session = await getServerSession(authOptions)
  return fetchRecent(session)
}

export async function POST(){
  const session = await getServerSession(authOptions)
  return fetchRecent(session)
}

// Delete all recent posts for the authenticated user (and Cloudinary images)
export async function DELETE(){
  const session = await getServerSession(authOptions)
  if(!session?.user?.id){
    return NextResponse.json({error:"Unauthorized"}, {status:401})
  }
  const client = await clientPromise
  const db = client.db()
  const postsCollection = db.collection("posts")
  const userId = session.user.id
  const posts = await postsCollection.find({userId}).toArray()
  // delete images in parallel
  await Promise.all(posts.map(async (p:any)=>{
    if(p.cloudinaryPublicId){
      try{ await deleteImage(p.cloudinaryPublicId) }catch(e){ console.error("Cloudinary delete fail", e) }
    }
  }))
  await postsCollection.deleteMany({userId})
  return NextResponse.json({success:true})
}
