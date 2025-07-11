import { signIn, getSession } from "next-auth/react"
import { ApiService } from "./api.service"

// Types pour les données d'authentification
export interface SigninData {
  email: string
  password: string
}

export interface SignupData {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  error?: string
  details?: any[]
}

export interface SigninResponse extends AuthResponse {
  session?: any
}

export interface SignupResponse extends AuthResponse {
  user?: {
    id: string
    name: string
    email: string
    created_at: string
  }
}

export interface ForgotPasswordResponse extends AuthResponse {}

export interface ResetPasswordResponse extends AuthResponse {}

/**
 * Service d'authentification pour centraliser les appels API
 */
export class AuthService {
  /**
   * Connexion avec les identifiants (email/password)
   */
  static async signInWithCredentials(data: SigninData): Promise<SigninResponse> {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        return {
          success: false,
          error: "Email ou mot de passe incorrect"
        }
      }

      if (result?.ok) {
        // Récupérer la session après connexion
        const session = await getSession()
        return {
          success: true,
          session
        }
      }

      return {
        success: false,
        error: "Erreur inconnue lors de la connexion"
      }
    } catch (error) {
      console.error("Erreur de connexion:", error)
      return {
        success: false,
        error: "Une erreur est survenue lors de la connexion"
      }
    }
  }

  /**
   * Connexion avec Google OAuth
   */
  static async signInWithGoogle(callbackUrl?: string): Promise<void> {
    try {
      await signIn("google", { callbackUrl })
    } catch (error) {
      console.error("Erreur de connexion Google:", error)
      throw new Error("Erreur lors de la connexion avec Google")
    }
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  static async signUp(data: SignupData): Promise<SignupResponse> {
    const response = await ApiService.post<{ user: SignupResponse['user'] }>("/api/auth/signup", data)

    if (!response.success) {
      return {
        success: false,
        error: response.error,
        details: response.details
      }
    }

    return {
      success: true,
      user: response.data?.user
    }
  }

  /**
   * Inscription avec Google OAuth
   */
  static async signUpWithGoogle(callbackUrl?: string): Promise<void> {
    try {
      await signIn("google", { callbackUrl })
    } catch (error) {
      console.error("Erreur d'inscription Google:", error)
      throw new Error("Erreur lors de l'inscription avec Google")
    }
  }

  /**
   * Connexion automatique après inscription
   */
  static async autoSignInAfterSignup(email: string, password: string): Promise<SigninResponse> {
    return this.signInWithCredentials({ email, password })
  }

  /**
   * Demande de réinitialisation de mot de passe
   * TODO: Remplacer par le vrai service quand l'API sera prête
   */
  static async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    try {
      // MOCK - À remplacer par le vrai appel API
      // const response = await ApiService.post<{}>("/api/auth/forgot-password", { email })
      
      // Simulation d'un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulation d'erreur pour certains emails
      if (email === "error@test.com") {
        return {
          success: false,
          error: "Cette adresse email n'existe pas dans notre système"
        }
      }

      return {
        success: true
      }
    } catch (error) {
      console.error("Erreur lors de la demande de réinitialisation:", error)
      return {
        success: false,
        error: "Une erreur est survenue lors de l'envoi de l'email"
      }
    }
  }

  /**
   * Réinitialisation du mot de passe avec token
   * TODO: Remplacer par le vrai service quand l'API sera prête
   */
  static async resetPassword(token: string, password: string): Promise<ResetPasswordResponse> {
    try {
      // MOCK - À remplacer par le vrai appel API
      // const response = await ApiService.post<{}>("/api/auth/reset-password", { token, password })
      
      // Simulation d'un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulation de token invalide/expiré
      if (token === "invalid-token") {
        return {
          success: false,
          error: "Le lien de réinitialisation est invalide ou a expiré"
        }
      }
      
      // Simulation d'un mot de passe trop faible
      if (password === "password") {
        return {
          success: false,
          error: "Ce mot de passe est trop faible. Veuillez choisir un mot de passe plus sécurisé."
        }
      }

      return {
        success: true
      }
    } catch (error) {
      console.error("Erreur lors de la réinitialisation:", error)
      return {
        success: false,
        error: "Une erreur est survenue lors de la réinitialisation du mot de passe"
      }
    }
  }
} 