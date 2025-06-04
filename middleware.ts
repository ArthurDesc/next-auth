import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  // Routes publiques (ne nécessitent pas d'authentification)
  const publicRoutes = ["/", "/auth/signin", "/auth/signup", "/api/auth/signup"]
  
  // Routes d'authentification
  const authRoutes = ["/auth/signin", "/auth/signup"]
  
  // Routes protégées (nécessitent une authentification)
  const protectedRoutes = ["/dashboard", "/profile"]

  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const isProtectedRoute = protectedRoutes.some(route => 
    nextUrl.pathname.startsWith(route)
  )
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)

  // Si l'utilisateur est connecté et essaie d'accéder aux pages d'auth
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/signin", nextUrl))
  }

  // Permettre l'accès à toutes les autres routes
  return NextResponse.next()
})

// Configuration des routes à surveiller
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
} 