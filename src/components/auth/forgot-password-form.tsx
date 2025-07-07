"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { AuthService } from "@/lib/services"

// Schéma de validation
const forgotPasswordSchema = z.object({
  email: z.string().email("Format d'email invalide"),
})

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>



export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [globalError, setGlobalError] = useState("")
  const [submittedEmail, setSubmittedEmail] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const handleForgotPassword = async (data: ForgotPasswordForm) => {
    setIsLoading(true)
    setGlobalError("")

    try {
      // Utilisation du service d'authentification
      const result = await AuthService.forgotPassword(data.email)

      if (!result.success) {
        setGlobalError(result.error || "Une erreur est survenue")
        return
      }

      // Succès - afficher le message de confirmation
      setSubmittedEmail(data.email)
      setIsSubmitted(true)
    } catch (error) {
      console.error("Erreur lors de la demande de réinitialisation:", error)
      setGlobalError("Une erreur est survenue lors de l'envoi de l'email")
    } finally {
      setIsLoading(false)
    }
  }

  // Affichage du message de confirmation
  if (isSubmitted) {
    return (
      <Card className="border-border shadow-xl bg-card">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            Email envoyé !
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Vérifiez votre boîte de réception
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Nous avons envoyé un lien de réinitialisation à :
            </p>
            <p className="font-semibold text-foreground">
              {submittedEmail}
            </p>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Important :</strong> Le lien expirera dans 15 minutes. 
                Si vous ne recevez pas l'email, vérifiez votre dossier spam.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/signin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la connexion
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full text-sm"
              onClick={() => {
                setIsSubmitted(false)
                setSubmittedEmail("")
                setGlobalError("")
              }}
            >
              Envoyer à une autre adresse
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Affichage du formulaire de demande
  return (
    <Card className="border-border shadow-xl bg-card">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-primary">
          Mot de passe oublié
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Entrez votre adresse email pour recevoir un lien de réinitialisation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Erreur globale */}
        {globalError && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Adresse email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="votre.email@exemple.com"
                {...register("email")}
                disabled={isLoading}
                className={`pl-10 bg-background border-input ${errors.email ? "border-destructive" : ""}`}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
          </Button>
        </form>

        <div className="text-center">
          <Link
            href="/auth/signin"
            className="text-sm text-button-primary hover:text-button-primary-hover font-medium cursor-pointer inline-flex items-center"
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            Retour à la connexion
          </Link>
        </div>
      </CardContent>
    </Card>
  )
} 