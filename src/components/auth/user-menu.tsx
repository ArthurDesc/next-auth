"use client"

import { useState } from "react"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { LogOut, User, Settings, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogoutConfirmation } from "@/components/auth/logout-confirmation"
import Link from "next/link"

export function UserMenu() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-auto px-3 py-2 hover:bg-accent hover:text-accent-foreground"
          disabled={isLoading}
        >
          <div className="flex items-center space-x-2">
            {session.user?.image ? (
              <Image
                src={session.user?.image}
                alt={getUserDisplayName()}
                width={28}
                height={28}
                className="w-7 h-7 rounded-full"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                {getInitials(session.user?.name)}
              </div>
            )}
            <span className="hidden sm:block text-sm font-medium max-w-24 truncate">
              {getUserDisplayName().split(" ")[0]}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {getUserDisplayName()}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <Link href="/profile" prefetch>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Mon profil</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        
        <LogoutConfirmation onConfirm={handleSignOut} isLoading={isLoading}>
          <DropdownMenuItem
            className="cursor-pointer text-red-600 focus:text-red-600"
            onSelect={(e) => e.preventDefault()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Se déconnecter</span>
          </DropdownMenuItem>
        </LogoutConfirmation>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 