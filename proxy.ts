import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Himoyalanmagan (ochiq) sahifalar — bu yerda login va admin qoladi
const PUBLIC_PATHS = ["/auth/login", "/auth/register", "/api/", "/_next/", "/favicon.ico"];

// Root '/' is the public landing page
const PUBLIC_EXACT = ["/"];

// Admin sahifasi o'z tokenini tekshiradi, shuning uchun ochiq qoldiramiz
const ADMIN_PATHS = ["/admin"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static files va public paths'ni o'tkazib yuboramiz
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p)) || PUBLIC_EXACT.includes(pathname);
  const isAdmin = ADMIN_PATHS.some((p) => pathname.startsWith(p));

  if (isPublic || isAdmin) {
    return NextResponse.next();
  }

  // user_session cookie'ni tekshiramiz
  const sessionToken = request.cookies.get("user_session")?.value;

  if (!sessionToken) {
    // Kirish sahifasiga yo'naltiramiz va qaerdan kelganini saqlaymiz
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Bu yo'llarni middleware nazorat qiladi
  matcher: [
    /*
     * Match all request paths EXCEPT for:
     * - api routes (handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files (.png, .jpg, etc)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
