import { UserService } from '../user.service'

// Mock global de fetch
global.fetch = jest.fn()

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock console.error pour éviter les logs pendant les tests
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('updateProfile', () => {
    it('met à jour le profil avec succès', async () => {
      const updateData = {
        name: 'Nouveau Nom',
        email: 'nouveau@example.com'
      }

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          message: 'Profil mis à jour avec succès',
          user: {
            id: 'user-123',
            name: 'Nouveau Nom',
            email: 'nouveau@example.com',
            image: null,
            updated_at: '2025-01-01T00:00:00.000Z'
          }
        })
      }

      ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

      const result = await UserService.updateProfile(updateData)

      expect(result.success).toBe(true)
      expect(result.user?.name).toBe('Nouveau Nom')
      expect(result.user?.email).toBe('nouveau@example.com')
      expect(result.message).toBe('Profil mis à jour avec succès')

      expect(global.fetch).toHaveBeenCalledWith('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })
    })

    it('gère les erreurs de réseau', async () => {
      const updateData = {
        name: 'Nouveau Nom'
      }

      ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

      const result = await UserService.updateProfile(updateData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Une erreur est survenue lors de la mise à jour du profil')
      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('changePassword', () => {
    it('change le mot de passe avec succès', async () => {
      const passwordData = {
        currentPassword: 'currentPassword123',
        newPassword: 'newPassword456'
      }

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          message: 'Mot de passe mis à jour avec succès'
        })
      }

      ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

      const result = await UserService.changePassword(passwordData)

      expect(result.success).toBe(true)
      expect(result.message).toBe('Mot de passe mis à jour avec succès')

      expect(global.fetch).toHaveBeenCalledWith('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      })
    })

    it('gère les erreurs de réseau', async () => {
      const passwordData = {
        currentPassword: 'currentPassword123',
        newPassword: 'newPassword456'
      }

      ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

      const result = await UserService.changePassword(passwordData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Une erreur est survenue lors du changement de mot de passe')
      expect(console.error).toHaveBeenCalled()
    })
  })
}) 