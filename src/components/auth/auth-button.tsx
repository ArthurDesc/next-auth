"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <Button disabled>Chargement...</Button>
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Connecté en tant que {session.user?.email}
        </span>
        <Button onClick={() => signOut()} variant="outline">
          Se déconnecter
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={() => signIn()}>
      Se connecter
    </Button>
  )
} 