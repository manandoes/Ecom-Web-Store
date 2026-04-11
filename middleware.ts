import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for session cookie
  const sessionCookie =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  const isLoggedIn = !!sessionCookie;

  // Protect /account/* routes
  if (pathname.startsWith("/account")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect /admin/* routes (basic check — role verified server-side)
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect logged-in users away from auth pages
  if (pathname.startsWith("/auth/") && isLoggedIn) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/auth/:path*"],
};
