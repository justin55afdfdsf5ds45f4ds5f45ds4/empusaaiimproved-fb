import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider     from "next-auth/providers/google";
import PinterestProvider  from "next-auth/providers/pinterest";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise      from "@/lib/mongodb";

// ─────────────────────────────────────────────
// 1. ENV sanity‑check
// ─────────────────────────────────────────────
[
  "AUTH_GOOGLE_ID",
  "AUTH_GOOGLE_SECRET",
  "AUTH_PINTEREST_ID",
  "AUTH_PINTEREST_SECRET",
  "AUTH_SECRET",
  "AUTH_URL",
  "MONGODB_URI",
].forEach((v) => {
  if (!process.env[v]) console.error(`⚠️  Missing env var: ${v}`);
});

// ─────────────────────────────────────────────
// 2. Auth options
// ─────────────────────────────────────────────
export const authOptions: NextAuthOptions = {
  debug: true,
  adapter: MongoDBAdapter(clientPromise),

  providers: [
    GoogleProvider({
      clientId:     process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),

    PinterestProvider({
      clientId:     process.env.AUTH_PINTEREST_ID!,
      clientSecret: process.env.AUTH_PINTEREST_SECRET!,
      // default scopes already include email/profile → no override
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async session({ session, token }) {
      if (session.user) session.user.id = token.sub;  // expose DB id on client
      return session;
    },
    async redirect() {
      return "/dashboard";                            // always land on dashboard
    },
  },

  pages: {
    signIn: "/login",
    error : "/auth-error",
  },

  secret: process.env.AUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
