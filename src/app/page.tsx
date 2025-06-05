import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/layout/navbar"
import { RouteGuard } from "@/components/auth/route-guard"
import Link from "next/link"

export default function Home() {
  return (
    <RouteGuard requireAuth={false}>
      <div className="min-h-screen bg-gradient-app">
        {/* Navigation */}
        <Navbar />

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
              Bienvenue sur NextAuth
            </h1>
          </div>
        </main>
      </div>
    </RouteGuard>
  )
}
