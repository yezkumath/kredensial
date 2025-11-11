import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = ["/Dashboard", "/profile", "/admin"];

  // Define public routes that don't require authentication
  const publicRoutes = ["/"];

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Get the token from cookies (adjust based on your auth method)
  const login = request.cookies.get("LoginData")?.value;

  // If accessing a protected route without a token
  if (isProtectedRoute && !login) {
    // Redirect to login page
    const redirectUrl = new URL("/", request.url);

    // Save the original URL in a query param
    redirectUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(redirectUrl);
  }

  // If accessing login page while already authenticated
  if (pathname === "/" && login) {
    // Check if there's a redirect parameter
    const redirectParam = request.nextUrl.searchParams.get("redirect");

    // if redirectParam has value use it otherwise redirect to /Dashboard
    const redirect = redirectParam ? redirectParam : "/Dashboard";

    // Redirect to dashboard or home page
    return NextResponse.redirect(new URL(redirect, request.url));
  }
  return NextResponse.next();
}
