"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  // Éviter les erreurs d'hydratation
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  // Utiliser resolvedTheme pour éviter les problèmes avec 'system'
  const currentTheme = mounted ? resolvedTheme : 'light'

  return (
    <Button
      variant="ghost"
      size="default"
      onClick={toggleTheme}
      className="w-10 h-10 px-0 hover:bg-accent hover:text-accent-foreground relative"
      disabled={!mounted}
    >
      <div className="relative w-4 h-4">
        {/* Icône soleil */}
        <svg
          className={`absolute inset-0 h-4 w-4 transition-all duration-300 ease-in-out ${
            currentTheme === 'light' 
              ? 'rotate-0 scale-100 opacity-100' 
              : 'rotate-90 scale-0 opacity-0'
          }`}
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2" />
          <path d="M12 21v2" />
          <path d="M4.22 4.22l1.42 1.42" />
          <path d="M18.36 18.36l1.42 1.42" />
          <path d="M1 12h2" />
          <path d="M21 12h2" />
          <path d="M4.22 19.78l1.42-1.42" />
          <path d="M18.36 5.64l1.42-1.42" />
        </svg>
        
        {/* Icône lune */}
        <svg
          className={`absolute inset-0 h-4 w-4 transition-all duration-300 ease-in-out ${
            currentTheme === 'dark' 
              ? 'rotate-0 scale-100 opacity-100' 
              : '-rotate-90 scale-0 opacity-0'
          }`}
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </div>
      
      <span className="sr-only">
        {currentTheme === "light" ? "Activer le mode sombre" : "Activer le mode clair"}
      </span>
    </Button>
  )
}

// Composant dropdown avancé pour plus d'options
export function ThemeSelector() {
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Thème:</span>
        <div className="px-3 py-1 text-sm border border-input bg-background rounded-md w-20 h-8" />
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">Thème:</span>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="px-3 py-1 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
      >
        <option value="light">Clair</option>
        <option value="dark">Sombre</option>
        <option value="system">Système</option>
      </select>
    </div>
  )
} 