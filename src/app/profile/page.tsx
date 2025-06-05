"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
  })

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-app">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-app">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Non connecté</p>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Appeler l'API pour mettre à jour les données utilisateur
      console.log("Données à sauvegarder:", formData)
      
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mettre à jour la session
      await update({
        ...session,
        user: {
          ...session.user,
          name: formData.name,
          email: formData.email,
        }
      })

      // Rediriger vers le dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getProviderLabel = (): string => {
    const provider = (session.user as { provider?: string })?.provider
    switch (provider) {
      case "google":
        return "Google"
      case "credentials":
      case "local":
        return "Local"
      default:
        return "Inconnu"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-app">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        {/* En-tête */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour au dashboard
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary/10 rounded-lg">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mon profil</h1>
            <p className="text-muted-foreground">Gérez vos informations personnelles</p>
          </div>
        </div>

        {/* Formulaire de profil */}
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>
              Modifiez vos informations de compte. Les changements seront sauvegardés automatiquement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom */}
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Votre nom complet"
                  className="w-full"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="votre.email@exemple.com"
                  className="w-full"
                />
              </div>

              {/* Provider (lecture seule) */}
              <div className="space-y-2">
                <Label htmlFor="provider">Méthode de connexion</Label>
                <Input
                  id="provider"
                  name="provider"
                  type="text"
                  value={getProviderLabel()}
                  disabled
                  className="w-full bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  La méthode de connexion ne peut pas être modifiée
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                  disabled={isLoading}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Informations du compte */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Informations du compte</CardTitle>
            <CardDescription>
              Détails techniques de votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">ID utilisateur</p>
                <p className="text-sm text-muted-foreground font-mono">
                  {session.user?.id || "Non disponible"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Provider</p>
                <p className="text-sm text-muted-foreground">
                  {getProviderLabel()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 