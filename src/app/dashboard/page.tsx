"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/layout/navbar"
import Link from "next/link"

export default function Dashboard() {
  // TODO: Récupérer les vraies données utilisateur depuis NextAuth
  const user = {
    name: "Jean Dupont",
    email: "jean.dupont@exemple.com",
    image: null,
    joinedAt: "Janvier 2025"
  }

  const handleSignOut = () => {
    // TODO: Implémenter la déconnexion avec NextAuth
    console.log("Déconnexion")
  }

  return (
    <div className="min-h-screen bg-gradient-app">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">
            Tableau de bord
          </h1>
          <p className="mt-2 text-muted-foreground">
            Bienvenue dans votre espace personnel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profil utilisateur */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-primary">
                <div className="w-12 h-12 btn-primary rounded-full flex items-center justify-center text-white font-bold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                Profil
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Informations de votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Membre depuis {user.joinedAt}</p>
              </div>
              <Button variant="outline" className="w-full hover:bg-accent hover:text-accent-foreground">
                Modifier le profil
              </Button>
            </CardContent>
          </Card>

          {/* Statistiques */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-primary">Activité</CardTitle>
              <CardDescription className="text-muted-foreground">
                Vos statistiques d&apos;utilisation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Sessions</span>
                <span className="text-lg font-semibold text-foreground">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Dernière connexion</span>
                <span className="text-sm text-foreground">Aujourd&apos;hui</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Temps passé</span>
                <span className="text-sm text-foreground">2h 34m</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-primary">Actions rapides</CardTitle>
              <CardDescription className="text-muted-foreground">
                Raccourcis vers les fonctionnalités
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start hover:bg-accent hover:text-accent-foreground">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Gérer le profil
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-accent hover:text-accent-foreground">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Paramètres
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleSignOut}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Se déconnecter
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Section d'informations */}
        <div className="mt-12">
          <Card className="border-border bg-gradient-to-r from-accent/50 to-muted/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold text-primary mb-4">
                🎉 Bienvenue dans votre tableau de bord !
              </h2>
              <p className="text-muted-foreground mb-6">
                Cette interface sera connectée à NextAuth.js v5 une fois l&apos;authentification configurée. 
                Vous pourrez alors voir vos vraies données utilisateur et gérer votre session.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/">
                  <Button variant="outline" className="hover:bg-accent hover:text-accent-foreground">
                    ← Retour à l&apos;accueil
                  </Button>
                </Link>
                <Button disabled className="opacity-50">
                  🔧 NextAuth en cours de configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 