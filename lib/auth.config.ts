export const authConfig = {
  providers: ['google'],
  callbacks: {
    signIn: async ({ user, account }) => {
      return true;
    },
    session: async ({ session, token }) => {
      return session;
    },
    jwt: async ({ token, user, account }) => {
      return token;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/auth-error',
    verifyRequest: '/auth/verify-request',
    newUser: '/dashboard'
  },
}; 