"use client";

import { Suspense } from "react"
import Loading from "./loading"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { supabase } from "@/lib/auth"
import { signIn } from "next-auth/react"
import bcrypt from "bcryptjs"

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CallbackClient />
    </Suspense>
  )
}

function CallbackClient() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      console.log('Auth callback started...')
      console.log('URL search params:', Object.fromEntries(searchParams.entries()))

      try {
        // Get the code from the URL
        const code = searchParams.get('code')
        
        if (!code) {
          console.error('No code found in URL')
          throw new Error('No code found in URL')
        }

        console.log('Found auth code:', code)

        const proceedWithSession = async (session: any) => {
          console.log('Session obtained:', {
            userId: session.user.id,
            email: session.user.email,
          })

          const { user } = session
          const metadata = user.user_metadata || {}

          console.log('Upserting user data to Supabase & ensuring credentials login compatibility...')

          // Generate a deterministic password based on user id (hashed before storing)
          const plainPassword = user.id
          const hashedPassword = await bcrypt.hash(plainPassword, 10)

          const { data: upsertData, error: upsertError } = await supabase
            .from('users')
            .upsert({
              id: user.id,
              email: user.email,
              name: metadata.full_name || metadata.name || user.email?.split('@')[0] || 'Anonymous',
              password: hashedPassword, // store hashed password for Credentials provider
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            } as any)
            .select()
            .single()

          if (upsertError) {
            throw upsertError
          }

          console.log('User data stored successfully:', upsertData)

          // Automatically establish NextAuth session using Credentials provider
          try {
            await signIn('credentials', {
              redirect: false,
              email: user.email,
              password: plainPassword,
            })
          } catch (err) {
            console.error('Failed to create NextAuth session:', err)
          }

          router.push('/dashboard')
        }

        // Attempt to get an existing session
        const { data: { session: currentSession }, error: getSessionError } = await supabase.auth.getSession()

        if (getSessionError) {
          throw getSessionError
        }

        if (currentSession) {
          await proceedWithSession(currentSession)
          return
        }

        // Wait for SIGNED_IN event if session isn't immediately available
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN' && session) {
            try {
              await proceedWithSession(session)
            } finally {
              subscription.unsubscribe()
            }
          }
        })
      } catch (error) {
        console.error('Auth callback error:', error)
        console.error('Full error details:', {
          name: error instanceof Error ? error.name : 'Unknown',
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        })
        
        const errorMsg = error instanceof Error ? error.message : 'Unknown error'
        console.log('Redirecting to login with error:', errorMsg)
        router.push('/login?error=' + encodeURIComponent(errorMsg))
      }
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Setting up your account...</h2>
        <p className="text-gray-500">Please wait while we complete the sign-in process.</p>
        <p className="text-sm text-gray-400 mt-2">Check the browser console for detailed progress.</p>
      </div>
    </div>
  )
}
