import { getSessionCookie } from "better-auth/cookies"
import { type NextRequest, NextResponse } from "next/server"

import { DASHBOARD_PREFIX } from "@/lib/dashboard-path"

const DEMO_AUTH_BYPASS = process.env.NEXT_PUBLIC_ENABLE_REAL_AUTH !== "1"

export function proxy(request: NextRequest) {
  if (DEMO_AUTH_BYPASS) {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl
  const sessionCookie = getSessionCookie(request)

  const isAuthRoute = pathname.startsWith("/auth")
  const isDashboardRoute = pathname.startsWith(DASHBOARD_PREFIX)

  if (isDashboardRoute && !sessionCookie) {
    const signInUrl = new URL("/auth/sign-in", request.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL(DASHBOARD_PREFIX, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
}
