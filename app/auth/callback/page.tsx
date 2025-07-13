'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
// getSession no longer needed
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

// Ensure this page is always rendered dynamically to safely use client-side hooks like useSearchParams.
export const dynamic = "force-dynamic";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const handleCallback = async () => {
      console.log('Auth callback started...');
      console.log('URL search params:', Object.fromEntries(searchParams.entries()));

      try {
        // Get the code from the URL
        const code = searchParams.get('code');
        
        if (!code) {
          console.error('No code found in URL');
          throw new Error('No code found in URL');
        }

        console.log('Found auth code:', code);

        const proceedWithSession = async (session: any) => {
          console.log('Session obtained:', {
            userId: session.user.id,
            email: session.user.email,
          });

          const { user } = session;
          const metadata = user.user_metadata || {};

          console.log('Upserting user data to Supabase...');
          const { data: upsertData, error: upsertError } = await supabase
            .from('users')
            .upsert({
              id: user.id,
              email: user.email,
              name: metadata.full_name || metadata.name || user.email?.split('@')[0] || 'Anonymous',
              avatar_url: metadata.avatar_url || null,
              provider: 'google',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              last_sign_in: new Date().toISOString(),
            })
            .select()
            .single();

          if (upsertError) {
            throw upsertError;
          }

          console.log('User data stored successfully:', upsertData);

          router.push('/dashboard');
        };

        // First check if session is already available
        const { data: { session: currentSession }} = await supabase.auth.getSession();

        if (currentSession) {
          await proceedWithSession(currentSession);
          return;
        }

        // Otherwise wait for SIGNED_IN event
        const { data: { subscription }} = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN' && session) {
            try {
              await proceedWithSession(session);
            } finally {
              subscription.unsubscribe();
            }
          }
        });

        // Timeout after 10 seconds if session not established
        setTimeout(() => {
          console.error('Session not established within timeout');
          subscription.unsubscribe();
          router.push('/login?error=Session+not+established');
        }, 10000);

        // Exit early; rest handled in listener
        return;

        // Get user metadata
        const metadata = {} as any; // placeholder to satisfy existing coderemoved
      } catch (error) {
        console.error('Auth callback error:', error);
        console.error('Full error details:', {
          name: error instanceof Error ? error.name : 'Unknown',
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
        
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.log('Redirecting to login with error:', errorMsg);
        router.push('/login?error=' + encodeURIComponent(errorMsg));
      }
    };

    // Run the callback handler
    handleCallback();
  }, [router, searchParams, supabase]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Setting up your account...</h2>
        <p className="text-gray-500">Please wait while we complete the sign-in process.</p>
        <p className="text-sm text-gray-400 mt-2">Check the browser console for detailed progress.</p>
      </div>
    </div>
  );
} 