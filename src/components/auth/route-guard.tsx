"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface RouteGuardProps {
  children: React.ReactNode
  requireAuth?: boolean // true = route protégée, false = route publique uniquement
}

export function RouteGuard({ children, requireAuth = true }: RouteGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      if (status === "loading") return // Attendre le chargement

      const isAuthenticated = !!session

      if (requireAuth) {
        // Route protégée : nécessite une authentification
        if (!isAuthenticated) {
          router.replace("/auth/signin")
          return
        }
      } else {
        // Route publique uniquement : interdite aux utilisateurs connectés
        if (isAuthenticated) {
          router.replace("/dashboard")
          return
        }
      }

      setIsAuthorized(true)
    }

    checkAuth()
  }, [session, status, router, requireAuth])

  // Affichage de chargement pendant la vérification
  if (status === "loading" || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-app flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 