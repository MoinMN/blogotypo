import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedPaths = [
  // user's
  '/profile',
  '/my-blogs',
  '/publish-blog',

  // admin's
  '/admin',
];

const publicApiPaths = [
  '/api/auth',
  '/api/blog/get',
  '/api/blog/search',
  '/api/blog/recommend',
  '/api/blog/getall',
  '/api/count',
  '/api/user/contact',
  '/api/googleIndexing/indexing'
]

export async function proxy(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (token) {
    // Redirect authenticated users to dashborad
    if (['/user/register', '/user/login', '/admin/login'].includes(pathname)) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = token.role === 'admin' ? '/admin/dashboard' : '/dashboard';
      return NextResponse.redirect(redirectUrl);
    }

    // // Role-based route access
    if (token.role === 'user' && pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  } else {
    // Allow unauthenticated access to `/admin/login`
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // If the path starts with `/api`, it's an unauthenticated access
    if (pathname.startsWith('/api') && !publicApiPaths.some(path => pathname.startsWith(path))) {
      return NextResponse.json({ msg: 'Unauthorized Access!' }, { status: 401 });
    }

    // Protect routes for unauthenticated users
    if (protectedPaths.some((protectedPath) => pathname.startsWith(protectedPath))) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/user/login';
      loginUrl.searchParams.set('callback', pathname)
      return NextResponse.redirect(loginUrl);
    }

    // Protect all `/admin/:path*` except `/admin/login`
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // user's
    '/profile',
    '/my-blogs',
    '/publish-blog',
    '/contact',
    '/blog/:path*',

    // admin's
    '/admin/:path*',

    // auth
    '/user/register',
    '/user/login',

    // api endpoint
    '/api/:path*',
  ],
};
