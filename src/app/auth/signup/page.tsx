import { SignupForm } from "@/components/auth/signup-form"
import { RouteGuard } from "@/components/auth/route-guard"

export default function SignUp() {
  return (
    <RouteGuard requireAuth={false}>
      <div className="min-h-screen bg-gradient-app">
        
        <div className="flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md">
            <SignupForm />

            <p className="mt-8 text-center text-xs text-muted-foreground">
              En vous inscrivant, vous acceptez nos conditions d&apos;utilisation et notre politique de confidentialité.
            </p>
          </div>
        </div>
      </div>
    </RouteGuard>
  )
} 