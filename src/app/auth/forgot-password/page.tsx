import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { RouteGuard } from "@/components/auth/route-guard"

export default function ForgotPasswordPage() {
  return (
    <RouteGuard requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <ForgotPasswordForm />
        </div>
      </div>
    </RouteGuard>
  )
}

export const metadata = {
  title: "Mot de passe oublié",
  description: "Réinitialisez votre mot de passe",
} 