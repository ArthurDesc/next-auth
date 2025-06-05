"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { AuthService, type SigninData } from "@/lib/services"

// Schéma de validation
const signinSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
})

type SigninForm = z.infer<typeof signinSchema>

interface SigninFormProps {
  callbackUrl?: string
}

export function SigninForm({ callbackUrl = "/dashboard" }: SigninFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [globalError, setGlobalError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninForm>({
    resolver: zodResolver(signinSchema),
  })

  const handleCredentialsSignin = async (data: SigninForm) => {
    setIsLoading(true)
    setGlobalError("")

    try {
      const signInData: SigninData = {
        email: data.email,
        password: data.password,
      }

      const result = await AuthService.signInWithCredentials(signInData)

      if (!result.success) {
        setGlobalError(result.error || "Erreur lors de la connexion")
        return
      }

      if (result.session) {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      console.error("Erreur de connexion:", error)
      setGlobalError("Une erreur est survenue lors de la connexion")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignin = async () => {
    setIsLoading(true)
    setGlobalError("")

    try {
      await AuthService.signInWithGoogle(callbackUrl)
    } catch (error: any) {
      setGlobalError(error.message || "Erreur lors de la connexion avec Google")
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-border shadow-xl bg-card">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-primary">
          Connexion
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Connectez-vous à votre compte
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Erreur globale */}
        {globalError && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {globalError}
          </div>
        )}

        {/* Google OAuth Button */}
        <Button
          onClick={handleGoogleSignin}
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
          {isLoading ? "Connexion..." : "Continuer avec Google"}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Ou continuer avec
            </span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit(handleCredentialsSignin)} className="space-y-4">
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

          <Button
            type="submit"
            className="w-full btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <Link
            href="/auth/signup"
            className="text-button-primary hover:text-button-primary-hover font-medium cursor-pointer"
          >
            Pas encore de compte ? S&apos;inscrire
          </Link>
        </div>
      </CardContent>
    </Card>
  )
} 