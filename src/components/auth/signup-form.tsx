"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

// Schéma de validation
const signupSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

type SignupForm = z.infer<typeof signupSchema>

interface SignupFormProps {
  callbackUrl?: string
}

export function SignupForm({ callbackUrl = "/dashboard" }: SignupFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [globalError, setGlobalError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  })

  const handleSignup = async (data: SignupForm) => {
    setIsLoading(true)
    setGlobalError("")
    setSuccessMessage("")

    try {
      // Appel API pour créer le compte
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.details) {
          // Erreurs de validation détaillées
          const errorMessage = result.details
            .map((error: { message: string }) => error.message)
            .join(", ")
          setGlobalError(errorMessage)
        } else {
          setGlobalError(result.error || "Erreur lors de la création du compte")
        }
        return
      }

      // Compte créé avec succès, connexion automatique
      setSuccessMessage("Compte créé avec succès ! Connexion en cours...")

      // Connexion automatique après inscription
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (signInResult?.ok) {
        router.push(callbackUrl)
        router.refresh()
      } else {
        // Si la connexion automatique échoue, rediriger vers la page de connexion
        router.push("/auth/signin?message=account-created")
      }

    } catch (error) {
      console.error("Erreur lors de l'inscription:", error)
      setGlobalError("Une erreur est survenue lors de la création du compte")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setIsLoading(true)
    setGlobalError("")

    try {
      await signIn("google", {
        callbackUrl,
      })
    } catch (error) {
      console.error("Erreur de connexion Google:", error)
      setGlobalError("Erreur lors de l'inscription avec Google")
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-border shadow-xl bg-card">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-primary">
          Inscription
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Créez votre compte pour commencer
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Messages */}
        {globalError && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {globalError}
          </div>
        )}
        
        {successMessage && (
          <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
            {successMessage}
          </div>
        )}

        {/* Google OAuth Button */}
        <Button
          onClick={handleGoogleSignup}
          variant="outline"
          className="w-full hover:bg-accent hover:text-accent-foreground"
          disabled={isLoading}
        >
          <svg
            className="mr-2 h-4 w-4"
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="google"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
          >
            <path
              fill="currentColor"
              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h240z"
            ></path>
          </svg>
          {isLoading ? "Inscription..." : "Continuer avec Google"}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Ou s&apos;inscrire avec
            </span>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit(handleSignup)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Nom complet</Label>
            <Input
              id="name"
              type="text"
              placeholder="Jean Dupont"
              {...register("name")}
              disabled={isLoading}
              className={`bg-background border-input ${errors.name ? "border-destructive" : ""}`}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="votre.email@exemple.com"
              {...register("email")}
              disabled={isLoading}
              className={`bg-background border-input ${errors.email ? "border-destructive" : ""}`}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              disabled={isLoading}
              className={`bg-background border-input ${errors.password ? "border-destructive" : ""}`}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground">
              Confirmer le mot de passe
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              disabled={isLoading}
              className={`bg-background border-input ${errors.confirmPassword ? "border-destructive" : ""}`}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Création du compte..." : "Créer mon compte"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <Link
            href="/auth/signin"
            className="text-button-primary hover:text-button-primary-hover font-medium"
          >
            Déjà un compte ? Se connecter
          </Link>
        </div>
      </CardContent>
    </Card>
  )
} 