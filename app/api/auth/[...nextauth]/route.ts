import NextAuth, { type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { SupabaseAdapter } from "@next-auth/supabase-adapter"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import bcrypt from "bcryptjs"
;["AUTH_GOOGLE_ID", "AUTH_GOOGLE_SECRET", "AUTH_SECRET", "NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"].forEach((v) => {
  if (!process.env[v]) console.error(`⚠️  Missing env var: ${v}`)
})

// ─────────────────────────────────────────────
// 2. Auth options
// ─────────────────────────────────────────────
export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),

  providers: [
    // ── Google ───────────────────────────────
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),

    // ── Email/Password ────────────────────────
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        try {
          const { data: user, error } = await supabaseAdmin.from("users").select("*").eq("email", credentials.email).single()

          if (error) {
            console.error("Supabase query error:", error)
            throw new Error("Invalid email or password")
          }

          if (!user || !user.password) {
            throw new Error("Invalid email or password")
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            throw new Error("Invalid email or password")
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            premiumUntil: (user as any).premiumuntil ?? null,
          }
        } catch (error) {
          console.error("Auth error:", error)
          throw new Error(error instanceof Error ? error.message : "Authentication failed")
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = (user as any).id
        token.premiumUntil = (user as any).premiumUntil ?? null
      }
      if (account) {
        token.accessToken = account.access_token
      }
      // Add premiumUntil to token from DB if not present
      if (!token.premiumUntil) {
        try {
          const { data: dbUser, error: dbErr } = await supabaseAdmin.from("users").select("premiumuntil").eq("id", token.id as string).single()
          if (!dbErr) {
            token.premiumUntil = (dbUser as any)?.premiumuntil ?? null
          }
        } catch (e) {
          console.error("Error fetching premiumUntil:", e)
        }
      }
      if (trigger === "update" && session) {
        token.name = session.name
        token.email = session.email
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string

        // Always fetch latest premiumUntil from DB so upgrades are reflected immediately
        try {
          const { data: dbUser, error: dbErr } = await supabaseAdmin
            .from("users")
            .select("premiumuntil")
            .eq("id", token.id as string)
            .single()

          if (!dbErr) {
            session.user.premiumUntil = (dbUser as any)?.premiumuntil ?? null
          } else {
            session.user.premiumUntil = token.premiumUntil as string | null
          }
        } catch {
          session.user.premiumUntil = token.premiumUntil as string | null
        }
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

  pages: {
    signIn: "/login",
    error: "/auth-error",
    signOut: "/",
  },

  secret: process.env.AUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
