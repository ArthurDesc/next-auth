"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, CheckCircle, Eye, EyeOff } from "lucide-react"
import { AuthService } from "@/lib/services"

// Schéma de validation
const resetPasswordSchema = z.object({
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

interface ResetPasswordFormProps {
  token: string
}



export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [globalError, setGlobalError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [countdown, setCountdown] = useState(5)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const password = watch("password")

  // Compteur pour la redirection
  useEffect(() => {
    if (isSubmitted && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (isSubmitted && countdown === 0) {
      router.push("/auth/signin")
    }
  }, [isSubmitted, countdown, router])

  const handleResetPassword = async (data: ResetPasswordForm) => {
    setIsLoading(true)
    setGlobalError("")

    try {
      // Utilisation du service d'authentification
      const result = await AuthService.resetPassword(token, data.password)

      if (!result.success) {
        setGlobalError(result.error || "Une erreur est survenue")
        return
      }

      // Succès - afficher le message de confirmation
      setIsSubmitted(true)
    } catch (error) {
      console.error("Erreur lors de la réinitialisation:", error)
      setGlobalError("Une erreur est survenue lors de la réinitialisation du mot de passe")
    } finally {
      setIsLoading(false)
    }
  }

  // Indicateur de force du mot de passe
  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, text: "", color: "" }
    
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    switch (score) {
      case 0:
      case 1:
        return { score, text: "Très faible", color: "text-red-500" }
      case 2:
        return { score, text: "Faible", color: "text-orange-500" }
      case 3:
        return { score, text: "Moyen", color: "text-yellow-500" }
      case 4:
        return { score, text: "Fort", color: "text-blue-500" }
      case 5:
        return { score, text: "Très fort", color: "text-green-500" }
      default:
        return { score: 0, text: "", color: "" }
    }
  }

  const passwordStrength = getPasswordStrength(password || "")

  // Affichage du message de confirmation
  if (isSubmitted) {
    return (
      <Card className="border-border shadow-xl bg-card">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            Mot de passe réinitialisé !
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Votre mot de passe a été mis à jour avec succès
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Succès !</strong> Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
              </p>
            </div>
            
            <p className="text-muted-foreground">
              Vous allez être redirigé vers la page de connexion dans{" "}
              <span className="font-semibold text-primary">{countdown}</span> seconde{countdown > 1 ? "s" : ""}...
            </p>
          </div>

          <Button 
            onClick={() => router.push("/auth/signin")}
            className="w-full btn-primary"
          >
            Aller à la connexion maintenant
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Affichage du formulaire de réinitialisation
  return (
    <Card className="border-border shadow-xl bg-card">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-primary">
          Nouveau mot de passe
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Choisissez un nouveau mot de passe sécurisé
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Erreur globale */}
        {globalError && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              Nouveau mot de passe
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                disabled={isLoading}
                className={`pl-10 pr-10 bg-background border-input ${errors.password ? "border-destructive" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            {/* Indicateur de force du mot de passe */}
            {password && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Force du mot de passe :</span>
                  <span className={passwordStrength.color}>{passwordStrength.text}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full transition-all duration-300 ${
                      passwordStrength.score <= 1 ? "bg-red-500" :
                      passwordStrength.score === 2 ? "bg-orange-500" :
                      passwordStrength.score === 3 ? "bg-yellow-500" :
                      passwordStrength.score === 4 ? "bg-blue-500" : "bg-green-500"
                    }`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
            
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground">
              Confirmer le mot de passe
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("confirmPassword")}
                disabled={isLoading}
                className={`pl-10 pr-10 bg-background border-input ${errors.confirmPassword ? "border-destructive" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <strong>Conseils pour un mot de passe sécurisé :</strong>
              </p>
              <ul className="text-xs text-blue-700 dark:text-blue-300 mt-1 space-y-1">
                <li>• Au moins 8 caractères</li>
                <li>• Mélangez majuscules, minuscules, chiffres et symboles</li>
                <li>• Évitez les mots du dictionnaire</li>
              </ul>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Mise à jour..." : "Réinitialiser le mot de passe"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 