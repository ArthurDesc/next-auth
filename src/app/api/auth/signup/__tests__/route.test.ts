import { POST } from '../route'
import { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

// Mock de Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  })),
}))

// Mock de bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}))

const mockPrisma = new PrismaClient()
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>

describe('/api/auth/signup', () => {
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

  it('crée un utilisateur avec des données valides', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    }

    // Mock: aucun utilisateur existant
    ;(mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null)
    
    // Mock: hachage du mot de passe
    ;(mockBcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123')
    
    // Mock: création de l'utilisateur
    const createdUser = {
      id: '1',
      name: userData.name,
      email: userData.email,
      created_at: new Date(),
    }
    ;(mockPrisma.user.create as jest.Mock).mockResolvedValue(createdUser)

    const request = createMockRequest(userData)
    const response = await POST(request)
    const responseData = await response.json()

    expect(response.status).toBe(201)
    expect(responseData.message).toBe('Compte créé avec succès')
    expect(responseData.user).toEqual(createdUser)

    // Vérifier que findUnique a été appelé avec le bon email
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: userData.email }
    })

    // Vérifier le hachage du mot de passe
    expect(mockBcrypt.hash).toHaveBeenCalledWith(userData.password, 12)

    // Vérifier la création de l'utilisateur
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        name: userData.name,
        email: userData.email,
        password_hash: 'hashedPassword123',
        provider: 'local',
      },
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true,
      },
    })
  })

  it('rejette les données invalides - nom trop court', async () => {
    const invalidData = {
      name: 'J', // Trop court
      email: 'john@example.com',
      password: 'password123'
    }

    const request = createMockRequest(invalidData)
    const response = await POST(request)
    const responseData = await response.json()

    expect(response.status).toBe(400)
    expect(responseData.error).toBe('Données invalides')
    expect(responseData.details).toBeDefined()
    expect(responseData.details[0].message).toContain('au moins 2 caractères')
  })

  it('rejette les données invalides - email invalide', async () => {
    const invalidData = {
      name: 'John Doe',
      email: 'invalid-email', // Email invalide
      password: 'password123'
    }

    const request = createMockRequest(invalidData)
    const response = await POST(request)
    const responseData = await response.json()

    expect(response.status).toBe(400)
    expect(responseData.error).toBe('Données invalides')
    expect(responseData.details[0].message).toContain('email invalide')
  })

  it('rejette les données invalides - mot de passe trop court', async () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: '123' // Trop court
    }

    const request = createMockRequest(invalidData)
    const response = await POST(request)
    const responseData = await response.json()

    expect(response.status).toBe(400)
    expect(responseData.error).toBe('Données invalides')
    expect(responseData.details[0].message).toContain('au moins 8 caractères')
  })

  it('rejette les données invalides - champs manquants', async () => {
    const invalidData = {
      // name manquant
      email: 'john@example.com',
      password: 'password123'
    }

    const request = createMockRequest(invalidData)
    const response = await POST(request)
    const responseData = await response.json()

    expect(response.status).toBe(400)
    expect(responseData.error).toBe('Données invalides')
    expect(responseData.details).toBeDefined()
  })

  it('rejette un email déjà existant', async () => {
    const userData = {
      name: 'John Doe',
      email: 'existing@example.com',
      password: 'password123'
    }

    // Mock: utilisateur existant trouvé
    const existingUser = {
      id: '1',
      email: userData.email,
      name: 'Existing User'
    }
    ;(mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser)

    const request = createMockRequest(userData)
    const response = await POST(request)
    const responseData = await response.json()

    expect(response.status).toBe(409)
    expect(responseData.error).toBe('Un compte avec cet email existe déjà')

    // Vérifier qu'on n'a pas essayé de créer l'utilisateur
    expect(mockPrisma.user.create).not.toHaveBeenCalled()
    expect(mockBcrypt.hash).not.toHaveBeenCalled()
  })

  it('gère les erreurs de base de données lors de la vérification d\'unicité', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    }

    // Mock: erreur lors de findUnique
    ;(mockPrisma.user.findUnique as jest.Mock).mockRejectedValue(
      new Error('Database connection error')
    )

    const request = createMockRequest(userData)
    const response = await POST(request)
    const responseData = await response.json()

    expect(response.status).toBe(500)
    expect(responseData.error).toBe('Erreur interne du serveur')

    // Vérifier que l'erreur a été loggée
    expect(console.error).toHaveBeenCalled()
  })

  it('gère les erreurs de base de données lors de la création', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    }

    // Mock: aucun utilisateur existant
    ;(mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null)
    
    // Mock: hachage réussi
    ;(mockBcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123')
    
    // Mock: erreur lors de la création
    ;(mockPrisma.user.create as jest.Mock).mockRejectedValue(
      new Error('Database constraint violation')
    )

    const request = createMockRequest(userData)
    const response = await POST(request)
    const responseData = await response.json()

    expect(response.status).toBe(500)
    expect(responseData.error).toBe('Erreur interne du serveur')

    // Vérifier que l'erreur a été loggée
    expect(console.error).toHaveBeenCalled()
  })

  it('gère les erreurs de hachage du mot de passe', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    }

    // Mock: aucun utilisateur existant
    ;(mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null)
    
    // Mock: erreur lors du hachage
    ;(mockBcrypt.hash as jest.Mock).mockRejectedValue(new Error('Hashing error'))

    const request = createMockRequest(userData)
    const response = await POST(request)
    const responseData = await response.json()

    expect(response.status).toBe(500)
    expect(responseData.error).toBe('Erreur interne du serveur')

    // Vérifier que la création n'a pas été tentée
    expect(mockPrisma.user.create).not.toHaveBeenCalled()
  })

  it('utilise le bon nombre de rounds pour bcrypt', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    }

    // Mock: aucun utilisateur existant
    ;(mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null)
    
    // Mock: hachage du mot de passe
    ;(mockBcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123')
    
    // Mock: création de l'utilisateur
    ;(mockPrisma.user.create as jest.Mock).mockResolvedValue({
      id: '1',
      name: userData.name,
      email: userData.email,
      created_at: new Date(),
    })

    const request = createMockRequest(userData)
    await POST(request)

    // Vérifier que bcrypt utilise 12 rounds comme configuré
    expect(mockBcrypt.hash).toHaveBeenCalledWith(userData.password, 12)
  })

  it('retourne uniquement les champs sélectionnés de l\'utilisateur', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    }

    // Mock: aucun utilisateur existant
    ;(mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null)
    
    // Mock: hachage du mot de passe
    ;(mockBcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123')
    
    // Mock: utilisateur créé avec tous les champs (simulant la DB)
    const fullUserData = {
      id: '1',
      name: userData.name,
      email: userData.email,
      password_hash: 'hashedPassword123',
      provider: 'local',
      created_at: new Date(),
      updated_at: new Date(),
      email_verified: null,
      image: null,
    }
    
    // Mais on ne retourne que les champs sélectionnés
    const selectedUserData = {
      id: fullUserData.id,
      name: fullUserData.name,
      email: fullUserData.email,
      created_at: fullUserData.created_at,
    }
    
    ;(mockPrisma.user.create as jest.Mock).mockResolvedValue(selectedUserData)

    const request = createMockRequest(userData)
    const response = await POST(request)
    const responseData = await response.json()

    expect(response.status).toBe(201)
    expect(responseData.user).toEqual(selectedUserData)
    
    // Vérifier que le mot de passe haché n'est pas retourné
    expect(responseData.user.password_hash).toBeUndefined()
    
    // Vérifier la sélection des champs dans la requête Prisma
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: expect.any(Object),
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true,
      },
    })
  })
}) 