"use client"

import { Navbar } from "@/components/layout/navbar"
import { SignupForm } from "@/components/auth/signup-form"

export default function SignUp() {
  return (
    <div className="min-h-screen bg-gradient-app">
      <Navbar />
      
      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <SignupForm />

          <p className="mt-8 text-center text-xs text-muted-foreground">
            En vous inscrivant, vous acceptez nos conditions d&apos;utilisation et notre politique de confidentialité.
          </p>
        </div>
      </div>
    </div>
  )
} 