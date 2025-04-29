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
    console.error(`Environment variable ${envVar} is required but not set`)
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    PinterestProvider({
      clientId: process.env.PINTEREST_APP_ID || "",
      clientSecret: process.env.PINTEREST_APP_SECRET || "",
      authorization: {
        params: {
          scope: "pins:read pins:write boards:read user_accounts:read",
        },
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub // Copy token.sub to session.user.id
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Handle different redirect scenarios
      if (url.startsWith("/api/auth/callback")) {
        return `${baseUrl}/dashboard`
      }
      if (url.startsWith(baseUrl)) {
        return url
      }
      return baseUrl
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth-error", // Add an error page
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
