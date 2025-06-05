"use client"

import { useState } from "react"
import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import { LogOut, User } from "lucide-react"

export function UserMenu() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  if (!session?.user) {
    return null
  }

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut({
        callbackUrl: "/",
      })
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
      setIsLoading(false)
    }
  }

  const getInitials = (name: string | null | undefined): string => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getUserDisplayName = (): string => {
    return session?.user?.name || session?.user?.email || "Utilisateur"
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
    <div className="relative">
      {/* User Avatar/Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
        disabled={isLoading}
      >
        {session.user?.image ? (
          <Image
            src={session.user?.image}
            alt={getUserDisplayName()}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
            {getInitials(session.user?.name)}
          </div>
        )}
        <span className="hidden md:block text-sm font-medium">
          {getUserDisplayName()}
        </span>
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-md shadow-lg z-50">
          <div className="p-3 border-b border-border">
            <p className="text-sm font-medium">{getUserDisplayName()}</p>
            <p className="text-xs text-muted-foreground">{session.user?.email}</p>
          </div>
          
          <div className="p-1">
            <button
              className="flex items-center w-full px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm transition-colors"
              onClick={() => setShowMenu(false)}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </button>
            
            <button
              className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-sm transition-colors"
              onClick={handleSignOut}
              disabled={isLoading}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{isLoading ? "Déconnexion..." : "Se déconnecter"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Overlay to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  )
} 