import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/layout/navbar"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-app">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
            Bienvenue sur NextAuth
          </h1>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/auth/signup">
              <Button size="lg" className="btn-primary px-8 py-3">
                Inscription
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg" className="px-8 py-3">
                Connexion
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
