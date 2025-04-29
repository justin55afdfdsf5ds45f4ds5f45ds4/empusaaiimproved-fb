import NextAuth, { type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import PinterestProvider from "next-auth/providers/pinterest"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"

// Check required environment variables
const requiredEnvVars = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "PINTEREST_APP_ID",
  "PINTEREST_APP_SECRET",
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
]

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Environment variable ${envVar} is required but not set`)
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    PinterestProvider({
      clientId: process.env.PINTEREST_APP_ID!,
      clientSecret: process.env.PINTEREST_APP_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub // <-- required for Pinterest button query
      }
      return session
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard` // always land on dashboard
    },
  },
  pages: {
    signIn: "/login",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
