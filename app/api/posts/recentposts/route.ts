import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

async function fetchRecent(session:any){
  if(!session?.user?.id){
    return NextResponse.json({posts:[]})
  }
  const client = await clientPromise
  const db = client.db()
  const postsCollection = db.collection("posts")

  const now = new Date()
  const since = new Date(now.getTime() - 24*60*60*1000)

  const recentPosts = await postsCollection.find({userId:session.user.id, createdAt:{$gte:since}}).sort({createdAt:-1}).toArray()
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
  const { deleteImage } = await import("@/lib/cloudinary1")
  await Promise.all(posts.map(async (p:any)=>{
    if(p.cloudinaryPublicId){
      try{ await deleteImage(p.cloudinaryPublicId) }catch(e){ console.error("Cloudinary delete fail", e) }
    }
  }))
  await postsCollection.deleteMany({userId})
  return NextResponse.json({success:true})
}
