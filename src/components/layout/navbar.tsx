"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { UserMenu } from "@/components/auth/user-menu"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"

export function Navbar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  
  const isLoading = status === "loading"
  const isAuthenticated = !!session

  return (
    <nav className="nav-glass border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary hover:text-button-primary transition-colors cursor-pointer">
              NextAuth
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* État de chargement */}
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            )}

            {/* Utilisateur non connecté */}
            {!isLoading && !isAuthenticated && (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost" className="hover:bg-accent hover:text-accent-foreground">
                    Connexion
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="btn-primary">
                    Inscription
                  </Button>
                </Link>
              </>
            )}

            {/* Utilisateur connecté */}
            {!isLoading && isAuthenticated && (
              <>
                {/* Navigation pour utilisateurs connectés */}
                <div className="hidden md:flex items-center space-x-2">
                  <Link href="/dashboard">
                    <Button 
                      variant={pathname === "/dashboard" ? "default" : "ghost"}
                      size="sm"
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button 
                      variant={pathname === "/profile" ? "default" : "ghost"}
                      size="sm"
                    >
                      Profil
                    </Button>
                  </Link>
                </div>

                {/* Menu utilisateur intégré */}
                <UserMenu />
              </>
            )}

            {/* Toggle de thème toujours visible */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
} 