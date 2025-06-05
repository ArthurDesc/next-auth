import { PUT } from '../route'
import { NextRequest } from 'next/server'
import { auth } from '@/auth'
import { PrismaClient } from '@prisma/client'

// Mock des dépendances
jest.mock('@/auth')
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  })),
}))

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockPrisma = new PrismaClient()

describe('/api/user/profile', () => {
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

  it('met à jour le nom de l\'utilisateur avec des données valides', async () => {
    const updateData = {
      name: 'Nouveau Nom'
    }

    // Mock: session authentifiée
    mockAuth.mockResolvedValue(mockSession)

    // Mock: pas d'utilisateur existant avec le même email (pas de vérification email ici)
    const updatedUser = {
      id: 'user-123',
      name: 'Nouveau Nom',
      email: 'user@example.com',
      image: null,
      updated_at: new Date().toISOString(),
    }

    ;(mockPrisma.user.update as jest.Mock).mockResolvedValue(updatedUser)

    const request = createMockRequest(updateData)
    const response = await PUT(request)
    const responseData = await response.json()

    expect(response.status).toBe(200)
    expect(responseData.message).toBe('Profil mis à jour avec succès')
    expect(responseData.user).toEqual(updatedUser)

    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-123' },
      data: { name: 'Nouveau Nom' },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        updated_at: true,
      },
    })
  })

  it('rejette la requête si l\'utilisateur n\'est pas authentifié', async () => {
    const updateData = {
      name: 'Nouveau Nom'
    }

    // Mock: pas de session
    mockAuth.mockResolvedValue(null)

    const request = createMockRequest(updateData)
    const response = await PUT(request)
    const responseData = await response.json()

    expect(response.status).toBe(401)
    expect(responseData.error).toBe('Non autorisé')

    // Vérifier qu'aucune opération en base n'a été effectuée
    expect(mockPrisma.user.update).not.toHaveBeenCalled()
    expect(mockPrisma.user.findFirst).not.toHaveBeenCalled()
  })

  it('rejette les données invalides - nom trop court', async () => {
    const updateData = {
      name: 'A' // Trop court
    }

    // Mock: session authentifiée
    mockAuth.mockResolvedValue(mockSession)

    const request = createMockRequest(updateData)
    const response = await PUT(request)
    const responseData = await response.json()

    expect(response.status).toBe(400)
    expect(responseData.error).toBe('Données invalides')
    expect(responseData.details).toBeDefined()
    expect(responseData.details[0].message).toContain('au moins 2 caractères')
  })
}) 