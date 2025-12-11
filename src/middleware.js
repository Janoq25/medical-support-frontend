import { NextResponse } from 'next/server'

export function middleware(req) {
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    const token = req.cookies.accessToken;
    console.log("token", token);
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // Applies to all routes under /dashboard
};
