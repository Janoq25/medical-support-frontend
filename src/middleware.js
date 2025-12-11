import { NextResponse } from "next/server";
export function middleware(request) {
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const tokenAccess = request.cookies.get("accessToken")?.value;
    const tokenJwt = request.cookies.get("jwt")?.value;
    if (!tokenAccess && !tokenJwt) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
