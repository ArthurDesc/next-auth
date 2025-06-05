"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ReactNode } from "react"

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      disableTransitionOnChange={true}
      themes={["light", "dark"]}
      storageKey="next-auth-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}

// Re-export the useTheme hook from next-themes
export { useTheme } from "next-themes" 