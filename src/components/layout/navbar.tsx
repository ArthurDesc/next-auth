"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { usePathname } from "next/navigation"

export function Navbar() {
  const pathname = usePathname()
  
  // TODO: Remplacer par les vraies données de session NextAuth
  const isAuthenticated = pathname.startsWith("/dashboard")

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
            {pathname === "/" && !isAuthenticated && (
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

            {isAuthenticated && (
              <>
                <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                  Déconnexion
                </Button>
              </>
            )}

            {pathname === "/" && isAuthenticated && (
              <Link href="/dashboard">
                <Button className="btn-primary">
                  Mon Dashboard
                </Button>
              </Link>
            )}

            {/* Toggle de thème toujours visible */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
} 