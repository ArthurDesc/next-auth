// Types pour les données de profil
export interface UpdateProfileData {
  name?: string
  email?: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

export interface UserProfileResponse {
  success: boolean
  user?: {
    id: string
    name: string | null
    email: string
    image: string | null
    updated_at: string
  }
  message?: string
  error?: string
}

export interface ChangePasswordResponse {
  success: boolean
  message?: string
  error?: string
}

/**
 * Service de gestion du profil utilisateur
 */
export class UserService {
  /**
   * Met à jour les informations de profil de l'utilisateur
   */
  static async updateProfile(data: UpdateProfileData): Promise<UserProfileResponse> {
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: result.error || "Erreur lors de la mise à jour du profil",
        }
      }

      return {
        success: true,
        user: result.user,
        message: result.message,
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error)
      return {
        success: false,
        error: "Une erreur est survenue lors de la mise à jour du profil",
      }
    }
  }

  /**
   * Change le mot de passe de l'utilisateur
   */
  static async changePassword(data: ChangePasswordData): Promise<ChangePasswordResponse> {
    try {
      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: result.error || "Erreur lors du changement de mot de passe",
        }
      }

      return {
        success: true,
        message: result.message,
      }
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error)
      return {
        success: false,
        error: "Une erreur est survenue lors du changement de mot de passe",
      }
    }
  }
} 