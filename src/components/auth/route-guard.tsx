"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface RouteGuardProps {
  children: React.ReactNode
  requireAuth?: boolean // true = route protégée, false = route publique uniquement
}

export function RouteGuard({ children, requireAuth = true }: RouteGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Attendre que la session soit chargée
    if (status === "loading") return

    const isAuthenticated = !!session

    if (requireAuth && !isAuthenticated) {
      // Route protégée : rediriger vers signin
      router.replace("/auth/signin")
      return
    }

    if (!requireAuth && isAuthenticated) {
      // Route publique : rediriger vers dashboard
      router.replace("/dashboard")
      return
    }
  }, [session, status, router, requireAuth])

  // Afficher le contenu immédiatement si pas de redirection nécessaire
  const isAuthenticated = !!session

  // Pendant le loading, afficher le contenu pour éviter le délai
  if (status === "loading") {
    return <>{children}</>
  }

  // Vérifier si une redirection est nécessaire
  const shouldRedirect = 
    (requireAuth && !isAuthenticated) || 
    (!requireAuth && isAuthenticated)

  // Si redirection en cours, ne pas afficher de loader bloquant
  if (shouldRedirect) {
    return <>{children}</>
  }

  return <>{children}</>
} 