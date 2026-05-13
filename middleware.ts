import { auth } from "@/lib/auth/config";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  // @ts-ignore - Assuming role is appended to the session token as verified in config.ts
  const role = req.auth?.user?.role;

  // Protect /account/* routes
  if (nextUrl.pathname.startsWith("/account")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect /admin/* routes
  if (nextUrl.pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Redirect logged-in users away from auth pages
  if (nextUrl.pathname.startsWith("/auth/") && isLoggedIn) {
    return NextResponse.redirect(new URL("/account", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
