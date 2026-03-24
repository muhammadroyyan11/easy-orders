import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Amankan semua rute di dalam "/admin" kecuali titik pendaratan login itu sendiri
  const isAdminRoute = path.startsWith('/admin') && !path.startsWith('/admin/login');

  if (isAdminRoute) {
    const session = request.cookies.get('admin_session');
    
    if (!session || session.value !== 'authenticated') {
      // Usir ke halaman login jika tidak membawa pass masuk (cookie)
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
