import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    // Validate fields
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection("users")

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const result = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      emailVerified: null,
      image: null,
      createdAt: new Date(),
    })

    const user = {
      _id: result.insertedId,
      name,
      email,
    }

    // Link credentials
    const adapter = MongoDBAdapter(client)
    await adapter.linkAccount({
      provider: "credentials",
      providerAccountId: user._id.toString(),
      userId: user._id.toString(),
      type: "credentials",
    })

    return NextResponse.json({ success: true, user }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 })
  }
}
