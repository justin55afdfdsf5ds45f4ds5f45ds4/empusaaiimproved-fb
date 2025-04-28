import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import clientPromise from "@/lib/mongodb"

// Check if MongoDB URI is available and valid
const validMongoURI =
  process.env.MONGODB_URI &&
  (process.env.MONGODB_URI.startsWith("mongodb://") || process.env.MONGODB_URI.startsWith("mongodb+srv://"))

// Only use MongoDB adapter if we have a valid URI
const adapter = validMongoURI
  ? (async () => {
      const { MongoDBAdapter } = await import("@auth/mongodb-adapter")
      return MongoDBAdapter(await clientPromise)
    })()
  : undefined

export const authOptions = {
  adapter: adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-client-secret",
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login", // Error code passed in query string as ?error=
    newUser: "/dashboard", // New users will be directed here on first sign in
  },
  callbacks: {
    async session({ session, user }) {
      // Add user ID to the session
      if (session.user && user) {
        session.user.id = user.id
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
