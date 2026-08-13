import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = [
  '/dashboard', 
  '/members', 
  '/events/manage', 
  '/gallery/manage', 
  '/sponsors/manage',
  '/settings'
];

export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Check if it's a protected route
  const isProtected = protectedRoutes.some(route => path.startsWith(route));
  
  if (isProtected) {
    // Check for the Better Auth session cookie
    const sessionCookie = 
      request.cookies.get('better-auth.session_token') || 
      request.cookies.get('__Secure-better-auth.session_token');
    
    // Optimistically redirect unauthenticated users at the Edge
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
