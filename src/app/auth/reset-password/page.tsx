"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { RouteGuard } from "@/components/auth/route-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  // Si pas de token, afficher une erreur
  if (!token) {
    return (
      <Card className="border-border shadow-xl bg-card">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            Lien invalide
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Le lien de réinitialisation est manquant ou invalide
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">
                <strong>Erreur :</strong> Ce lien de réinitialisation n'est pas valide. 
                Il se peut qu'il soit expiré ou malformé.
              </p>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Vous pouvez demander un nouveau lien de réinitialisation depuis la page de connexion.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/auth/forgot-password">
                Demander un nouveau lien
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/signin">
                Retour à la connexion
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return <ResetPasswordForm token={token} />
}

export default function ResetPasswordPage() {
  return (
    <RouteGuard requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Suspense fallback={
            <Card className="border-border shadow-xl bg-card">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center text-primary">
                  Chargement...
                </CardTitle>
                <CardDescription className="text-center text-muted-foreground">
                  Vérification du lien de réinitialisation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              </CardContent>
            </Card>
          }>
            <ResetPasswordContent />
          </Suspense>
        </div>
      </div>
    </RouteGuard>
  )
} 