import NextAuth, { type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
// Comment out Pinterest provider for now to simplify debugging
// import PinterestProvider from "next-auth/providers/pinterest"
// import { MongoDBAdapter } from "@auth/mongodb-adapter"
// import clientPromise from "@/lib/mongodb"

// ─────────────────────────────────────────────
// 1. ENV sanity‑check
// ─────────────────────────────────────────────
;["AUTH_GOOGLE_ID", "AUTH_GOOGLE_SECRET", "AUTH_SECRET"].forEach((v) => {
  if (!process.env[v]) console.error(`⚠️  Missing env var: ${v}`)
})

// ─────────────────────────────────────────────
// 2. Auth options
// ─────────────────────────────────────────────
export const authOptions: NextAuthOptions = {
  debug: true,
  // Temporarily disable MongoDB adapter to simplify debugging
  // adapter: MongoDBAdapter(clientPromise),

  providers: [
    // ── Google ───────────────────────────────
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),

    // Temporarily comment out Pinterest provider
    /*
    // ── Pinterest (no native e‑mail) ─────────
    PinterestProvider({
      clientId: process.env.AUTH_PINTEREST_ID!,
      clientSecret: process.AUTH_PINTEREST_SECRET!,
      authorization: {
        // default + write + boards; email NOT available
        params: { scope: "user_accounts:read,pins:read,boards:read,pins:write" },
      },
      profile(p) {
        // fabricate an e‑mail so the Mongo adapter's unique index is satisfied
        return {
          id: p.id,
          name: p.username,
          email: `${p.id}@pinterest.user`,
          image: p.profile_image ?? null,
        }
      },
    }),
    */
  ],

  // merge Google + Pinterest accounts for same user if they collide
  allowDangerousEmailAccountLinking: true,

  session: { strategy: "jwt" },

  callbacks: {
    async session({ session, token }) {
      if (session.user) session.user.id = token.sub // expose DB id on client
      return session
    },
    async redirect() {
      return "/dashboard" // always land on dashboard
    },
  },

  pages: {
    signIn: "/login",
    error: "/auth-error",
  },

  secret: process.env.AUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
