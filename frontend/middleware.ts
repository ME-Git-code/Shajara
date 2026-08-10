import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnLogin = req.nextUrl.pathname.startsWith("/login");

  // Login qilmagan va login sahifasida bo'lmasa — /login ga yubor
  if (!isLoggedIn && !isOnLogin) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Login qilgan, lekin hali /login sahifasida tursa — bosh sahifaga yubor
  if (isLoggedIn && isOnLogin) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
