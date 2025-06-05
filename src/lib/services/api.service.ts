// Configuration et utilitaires pour les appels API

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  details?: any[]
}

export interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
}

/**
 * Service générique pour les appels API
 */
export class ApiService {
  private static readonly baseUrl = process.env.NEXT_PUBLIC_API_URL || ''

  /**
   * Configuration par défaut des headers
   */
  private static getDefaultHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
    }
  }

  /**
   * Appel API générique
   */
  static async request<T = any>(
    endpoint: string,
    config: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const {
        method = 'GET',
        headers = {},
        body,
      } = config

      const requestConfig: RequestInit = {
        method,
        headers: {
          ...this.getDefaultHeaders(),
          ...headers,
        },
      }

      // Ajouter le body pour les méthodes qui le supportent
      if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
        requestConfig.body = JSON.stringify(body)
      }

      const response = await fetch(url, requestConfig)
      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `Erreur HTTP ${response.status}`,
          details: data.details,
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      console.error(`Erreur API sur ${endpoint}:`, error)
      return {
        success: false,
        error: 'Erreur de connexion au serveur',
      }
    }
  }

  /**
   * Raccourci pour les requêtes GET
   */
  static async get<T = any>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', headers })
  }

  /**
   * Raccourci pour les requêtes POST
   */
  static async post<T = any>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body, headers })
  }

  /**
   * Raccourci pour les requêtes PUT
   */
  static async put<T = any>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', body, headers })
  }

  /**
   * Raccourci pour les requêtes DELETE
   */
  static async delete<T = any>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', headers })
  }

  /**
   * Raccourci pour les requêtes PATCH
   */
  static async patch<T = any>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PATCH', body, headers })
  }
} 