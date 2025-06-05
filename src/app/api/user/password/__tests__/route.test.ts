import { PUT } from '../route'
import { NextRequest } from 'next/server'
import { auth } from '@/auth'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

// Mock des dépendances
jest.mock('@/auth')
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  })),
}))
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}))

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockPrisma = new PrismaClient()
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>

describe('/api/user/password', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock console.error pour éviter les logs pendant les tests
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  const createMockRequest = (body: any): NextRequest => {
    return {
      json: jest.fn().mockResolvedValue(body),
    } as any
  }

  const mockSession = {
    user: {
      id: 'user-123',
      email: 'user@example.com',
      name: 'Test User'
    }
  }

  const mockUser = {
    id: 'user-123',
    password_hash: 'currentHashedPassword',
    provider: 'local'
  }

  it('change le mot de passe avec des données valides', async () => {
    const passwordData = {
      currentPassword: 'currentPassword123',
      newPassword: 'newPassword456'
    }

    // Mock: session authentifiée
    mockAuth.mockResolvedValue(mockSession)

    // Mock: utilisateur trouvé avec mot de passe local
    ;(mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

    // Mock: mot de passe actuel valide
    ;(mockBcrypt.compare as jest.Mock).mockResolvedValue(true)

    // Mock: hachage du nouveau mot de passe
    ;(mockBcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword456')

    // Mock: mise à jour réussie
    ;(mockPrisma.user.update as jest.Mock).mockResolvedValue({})

    const request = createMockRequest(passwordData)
    const response = await PUT(request)
    const responseData = await response.json()

    expect(response.status).toBe(200)
    expect(responseData.message).toBe('Mot de passe mis à jour avec succès')

    // Vérifier la récupération de l'utilisateur
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'user-123' },
      select: {
        id: true,
        password_hash: true,
        provider: true,
      }
    })

    // Vérifier la comparaison du mot de passe actuel
    expect(mockBcrypt.compare).toHaveBeenCalledWith('currentPassword123', 'currentHashedPassword')

    // Vérifier le hachage du nouveau mot de passe avec 12 rounds
    expect(mockBcrypt.hash).toHaveBeenCalledWith('newPassword456', 12)

    // Vérifier la mise à jour en base
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-123' },
      data: {
        password_hash: 'newHashedPassword456',
      },
    })
  })

  it('rejette la requête si l\'utilisateur n\'est pas authentifié', async () => {
    const passwordData = {
      currentPassword: 'currentPassword123',
      newPassword: 'newPassword456'
    }

    // Mock: pas de session
    mockAuth.mockResolvedValue(null)

    const request = createMockRequest(passwordData)
    const response = await PUT(request)
    const responseData = await response.json()

    expect(response.status).toBe(401)
    expect(responseData.error).toBe('Non autorisé')

    // Vérifier qu'aucune opération en base n'a été effectuée
    expect(mockPrisma.user.findUnique).not.toHaveBeenCalled()
    expect(mockPrisma.user.update).not.toHaveBeenCalled()
  })

  it('rejette les données invalides - mot de passe actuel manquant', async () => {
    const passwordData = {
      currentPassword: '', // Vide
      newPassword: 'newPassword456'
    }

    // Mock: session authentifiée
    mockAuth.mockResolvedValue(mockSession)

    const request = createMockRequest(passwordData)
    const response = await PUT(request)
    const responseData = await response.json()

    expect(response.status).toBe(400)
    expect(responseData.error).toBe('Données invalides')
    expect(responseData.details).toBeDefined()
    expect(responseData.details[0].message).toContain('mot de passe actuel est requis')
  })

  it('rejette les données invalides - nouveau mot de passe trop court', async () => {
    const passwordData = {
      currentPassword: 'currentPassword123',
      newPassword: '123' // Trop court
    }

    // Mock: session authentifiée
    mockAuth.mockResolvedValue(mockSession)

    const request = createMockRequest(passwordData)
    const response = await PUT(request)
    const responseData = await response.json()

    expect(response.status).toBe(400)
    expect(responseData.error).toBe('Données invalides')
    expect(responseData.details[0].message).toContain('au moins 8 caractères')
  })

  it('rejette si l\'utilisateur n\'est pas trouvé', async () => {
    const passwordData = {
      currentPassword: 'currentPassword123',
      newPassword: 'newPassword456'
    }

    // Mock: session authentifiée
    mockAuth.mockResolvedValue(mockSession)

    // Mock: utilisateur non trouvé
    ;(mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null)

    const request = createMockRequest(passwordData)
    const response = await PUT(request)
    const responseData = await response.json()

    expect(response.status).toBe(404)
    expect(responseData.error).toBe('Utilisateur non trouvé')
  })

  it('rejette si l\'utilisateur n\'a pas de compte local', async () => {
    const passwordData = {
      currentPassword: 'currentPassword123',
      newPassword: 'newPassword456'
    }

    // Mock: session authentifiée
    mockAuth.mockResolvedValue(mockSession)

    // Mock: utilisateur avec provider OAuth (sans mot de passe)
    const oauthUser = {
      id: 'user-123',
      password_hash: null,
      provider: 'google'
    }
    ;(mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(oauthUser)

    const request = createMockRequest(passwordData)
    const response = await PUT(request)
    const responseData = await response.json()

    expect(response.status).toBe(400)
    expect(responseData.error).toBe('Impossible de modifier le mot de passe pour ce type de compte')
  })

  it('rejette si le mot de passe actuel est incorrect', async () => {
    const passwordData = {
      currentPassword: 'wrongPassword',
      newPassword: 'newPassword456'
    }

    // Mock: session authentifiée
    mockAuth.mockResolvedValue(mockSession)

    // Mock: utilisateur trouvé
    ;(mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

    // Mock: mot de passe actuel invalide
    ;(mockBcrypt.compare as jest.Mock).mockResolvedValue(false)

    const request = createMockRequest(passwordData)
    const response = await PUT(request)
    const responseData = await response.json()

    expect(response.status).toBe(400)
    expect(responseData.error).toBe('Mot de passe actuel incorrect')

    // Vérifier qu'on n'a pas essayé de mettre à jour le mot de passe
    expect(mockPrisma.user.update).not.toHaveBeenCalled()
    expect(mockBcrypt.hash).not.toHaveBeenCalled()
  })

  it('gère les erreurs de base de données lors de la récupération de l\'utilisateur', async () => {
    const passwordData = {
      currentPassword: 'currentPassword123',
      newPassword: 'newPassword456'
    }

    // Mock: session authentifiée
    mockAuth.mockResolvedValue(mockSession)

    // Mock: erreur lors de findUnique
    ;(mockPrisma.user.findUnique as jest.Mock).mockRejectedValue(
      new Error('Database connection error')
    )

    const request = createMockRequest(passwordData)
    const response = await PUT(request)
    const responseData = await response.json()

    expect(response.status).toBe(500)
    expect(responseData.error).toBe('Erreur interne du serveur')

    // Vérifier que l'erreur a été loggée
    expect(console.error).toHaveBeenCalled()
  })

  it('gère les erreurs de hachage du nouveau mot de passe', async () => {
    const passwordData = {
      currentPassword: 'currentPassword123',
      newPassword: 'newPassword456'
    }

    // Mock: session authentifiée
    mockAuth.mockResolvedValue(mockSession)

    // Mock: utilisateur trouvé
    ;(mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

    // Mock: mot de passe actuel valide
    ;(mockBcrypt.compare as jest.Mock).mockResolvedValue(true)

    // Mock: erreur lors du hachage
    ;(mockBcrypt.hash as jest.Mock).mockRejectedValue(new Error('Hashing error'))

    const request = createMockRequest(passwordData)
    const response = await PUT(request)
    const responseData = await response.json()

    expect(response.status).toBe(500)
    expect(responseData.error).toBe('Erreur interne du serveur')

    // Vérifier que la mise à jour n'a pas été tentée
    expect(mockPrisma.user.update).not.toHaveBeenCalled()
  })

  it('gère les erreurs de base de données lors de la mise à jour', async () => {
    const passwordData = {
      currentPassword: 'currentPassword123',
      newPassword: 'newPassword456'
    }

    // Mock: session authentifiée
    mockAuth.mockResolvedValue(mockSession)

    // Mock: utilisateur trouvé
    ;(mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

    // Mock: mot de passe actuel valide
    ;(mockBcrypt.compare as jest.Mock).mockResolvedValue(true)

    // Mock: hachage réussi
    ;(mockBcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword456')

    // Mock: erreur lors de la mise à jour
    ;(mockPrisma.user.update as jest.Mock).mockRejectedValue(
      new Error('Database update error')
    )

    const request = createMockRequest(passwordData)
    const response = await PUT(request)
    const responseData = await response.json()

    expect(response.status).toBe(500)
    expect(responseData.error).toBe('Erreur interne du serveur')

    // Vérifier que l'erreur a été loggée
    expect(console.error).toHaveBeenCalled()
  })

  it('utilise le bon nombre de rounds pour bcrypt', async () => {
    const passwordData = {
      currentPassword: 'currentPassword123',
      newPassword: 'newPassword456'
    }

    // Mock: session authentifiée
    mockAuth.mockResolvedValue(mockSession)

    // Mock: utilisateur trouvé
    ;(mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

    // Mock: mot de passe actuel valide
    ;(mockBcrypt.compare as jest.Mock).mockResolvedValue(true)

    // Mock: hachage du nouveau mot de passe
    ;(mockBcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword456')

    // Mock: mise à jour réussie
    ;(mockPrisma.user.update as jest.Mock).mockResolvedValue({})

    const request = createMockRequest(passwordData)
    await PUT(request)

    // Vérifier que bcrypt utilise 12 rounds comme configuré
    expect(mockBcrypt.hash).toHaveBeenCalledWith('newPassword456', 12)
  })
}) 