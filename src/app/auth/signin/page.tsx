"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/layout/navbar"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // TODO: Implémenter la logique de connexion avec NextAuth
    console.log("Connexion avec:", { email, password })
    
    // Simulation d'un délai
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    
    // TODO: Implémenter la connexion Google OAuth
    console.log("Connexion avec Google")
    
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-app">
      <Navbar />
      
      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
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
              {/* Google OAuth Button */}
              <Button
                onClick={handleGoogleSignIn}
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre.email@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-background border-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-background border-input"
                  />
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
                  className="text-button-primary hover:text-button-primary-hover font-medium"
                >
                  Pas encore de compte ? S&apos;inscrire
                </Link>
              </div>
            </CardContent>
          </Card>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            En vous connectant, vous acceptez nos conditions d&apos;utilisation et notre politique de confidentialité.
          </p>
        </div>
      </div>
    </div>
  )
} 