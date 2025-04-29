import NextAuth, { type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import PinterestProvider from "next-auth/providers/pinterest"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"

// Check for required environment variables
if (!process.env.GOOGLE_CLIENT_ID) throw new Error("Missing GOOGLE_CLIENT_ID")
if (!process.env.GOOGLE_CLIENT_SECRET) throw new Error("Missing GOOGLE_CLIENT_SECRET")
if (!process.env.PINTEREST_APP_ID) throw new Error("Missing PINTEREST_APP_ID")
if (!process.env.PINTEREST_APP_SECRET) throw new Error("Missing PINTEREST_APP_SECRET")
if (!process.env.NEXTAUTH_URL) throw new Error("Missing NEXTAUTH_URL")
if (!process.env.NEXTAUTH_SECRET) throw new Error("Missing NEXTAUTH_SECRET")

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    PinterestProvider({
      clientId: process.env.PINTEREST_APP_ID,
      clientSecret: process.env.PINTEREST_APP_SECRET,
      authorization: { params: { scope: "pins:read pins:write boards:read" } },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const client = await clientPromise
        const db = client.db()
        const user = await db.collection("users").findOne({ email: credentials.email })

        if (!user || !user.password) {
          return null
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.password)

        if (!passwordMatch) {
          return null
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
        }
      },
    }),
  ],
  session: {
    strategy: "database",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // if sign-in succeeded → dashboard
      if (url.startsWith("/api/auth/callback")) return `${baseUrl}/dashboard`
      return baseUrl // default
    },
  },
  pages: {
    signIn: "/login",
  },
}

export const { GET, POST } = NextAuth(authOptions)
