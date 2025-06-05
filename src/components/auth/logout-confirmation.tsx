"use client"

import { Button } from "@/components/ui/button"
import { LogOut, AlertTriangle } from "lucide-react"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogTrigger,
  ResponsiveDialogClose,
} from "@/components/ui/responsive-dialog"

interface LogoutConfirmationProps {
  children: React.ReactNode
  onConfirm: () => void
  isLoading?: boolean
}

export function LogoutConfirmation({ 
  children, 
  onConfirm, 
  isLoading = false 
}: LogoutConfirmationProps) {
  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger>
        {children}
      </ResponsiveDialogTrigger>
      
      <ResponsiveDialogContent
        title="Confirmer la déconnexion"
        description="Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre compte."
      >
        <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg mb-4">
          <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
          <div className="text-sm text-orange-800 dark:text-orange-200">
            Cette action fermera votre session actuelle.
          </div>
        </div>
        
        <div className="flex gap-3 justify-end">
          <ResponsiveDialogClose>
            <Button variant="outline" disabled={isLoading}>
              Annuler
            </Button>
          </ResponsiveDialogClose>
          
          <ResponsiveDialogClose>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isLoading ? "Déconnexion..." : "Se déconnecter"}
            </Button>
          </ResponsiveDialogClose>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
} 