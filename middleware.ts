import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    // Create a response to modify its headers
    const response = NextResponse.next();

    // Create a Supabase client
    const supabase = createMiddlewareClient({ req: request, res: response });

    // Refresh session if expired
    const { data: { session }, error } = await supabase.auth.getSession();

    // Log for debugging
    console.log('Middleware session check:', {
      hasSession: !!session,
      path: request.nextUrl.pathname,
      error: error?.message
    });

    // Handle auth redirects
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      if (!session) {
        // Redirect to login if no session
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - auth callback (to prevent redirect loops)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|auth/callback).*)',
  ],
};
