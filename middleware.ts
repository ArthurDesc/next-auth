import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const { nextUrl } = req
  
  // Récupérer le token JWT pour vérifier l'authentification
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  })
  
  const isLoggedIn = !!token

  // Routes d'authentification (signin, signup)
  const authRoutes = ["/auth/signin", "/auth/signup"]
  
  // Routes protégées (nécessitent une authentification)
  const protectedRoutes = ["/dashboard", "/profile"]

  // Routes API d'authentification (toujours accessibles)
  const authApiRoutes = ["/api/auth/signup"]

  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const isProtectedRoute = protectedRoutes.some(route => 
    nextUrl.pathname.startsWith(route)
  )
  const isAuthApiRoute = authApiRoutes.some(route => 
    nextUrl.pathname.startsWith(route)
  )

  // Laisser passer les routes API d'authentification
  if (isAuthApiRoute) {
    return NextResponse.next()
  }

  // Si l'utilisateur est connecté
  if (isLoggedIn) {
    // Rediriger vers le dashboard si il essaie d'accéder aux pages d'auth ou page d'accueil
    if (isAuthRoute || nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }
    
    // Permettre l'accès aux routes protégées
    if (isProtectedRoute) {
      return NextResponse.next()
    }
  }

  // Si l'utilisateur n'est pas connecté
  if (!isLoggedIn) {
    // Rediriger vers signin pour les routes protégées
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/auth/signin", nextUrl))
    }
  }

  // Permettre l'accès par défaut (notamment pour "/")
  return NextResponse.next()
}

// Configuration des routes à surveiller
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) sauf /api/auth/signup
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/(?!auth/signup)).*)",
  ],
} 