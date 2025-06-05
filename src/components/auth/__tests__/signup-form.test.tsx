import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { SignupForm } from '../signup-form'

// Mock des dépendances
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}))

// Mock de fetch global
global.fetch = jest.fn()

const mockRouter = {
  push: jest.fn(),
  refresh: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
}

const mockSignIn = signIn as jest.MockedFunction<typeof signIn>
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('SignupForm', () => {
  beforeEach(() => {
    // Reset des mocks avant chaque test
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue(mockRouter as any)
    
    // Mock console.error pour éviter les logs d'erreur dans les tests
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('rend le formulaire correctement', () => {
    const { container } = render(<SignupForm />)
    
    // Vérifier la présence des éléments principaux
    expect(container.querySelector('form')).toBeTruthy()
    expect(container.textContent).toContain('Inscription')
  })

  it('valide les champs requis', async () => {
    const user = userEvent.setup()
    const { container } = render(<SignupForm />)
    
    const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement
    await user.click(submitButton)
    
    // Attendre que la validation soit affichée
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Vérifier qu'il y a des messages d'erreur
    expect(container.textContent).toContain('caractères')
  })

  it('envoie les données à l\'API lors de l\'inscription réussie', async () => {
    const user = userEvent.setup()
    
    // Mock de la réponse API d'inscription réussie
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: 'Compte créé avec succès',
        user: {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com'
        }
      })
    } as Response)
    
    // Mock de signIn réussie
    mockSignIn.mockResolvedValueOnce({
      ok: true,
      error: undefined,
      status: 200,
      url: null,
      code: undefined
    } as any)
    
    const { container } = render(<SignupForm />)
    
    // Remplir le formulaire
    const nameInput = container.querySelector('input[name="name"]') as HTMLInputElement
    const emailInput = container.querySelector('input[name="email"]') as HTMLInputElement  
    const passwordInput = container.querySelector('input[name="password"]') as HTMLInputElement
    const confirmPasswordInput = container.querySelector('input[name="confirmPassword"]') as HTMLInputElement
    
    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')
    
    const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement
    await user.click(submitButton)
    
    // Attendre que la requête soit envoyée
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Vérifier que fetch a été appelé
    expect(mockFetch).toHaveBeenCalledWith('/api/auth/signup', expect.objectContaining({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      }),
    }))
  })

  it('affiche les erreurs de validation du serveur', async () => {
    const user = userEvent.setup()
    
    // Mock de la réponse API avec erreurs de validation
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: 'Données invalides',
        details: [
          { message: 'Email déjà utilisé' },
          { message: 'Mot de passe trop faible' }
        ]
      })
    } as Response)
    
    const { container } = render(<SignupForm />)
    
    // Remplir le formulaire avec des données invalides
    const nameInput = container.querySelector('input[name="name"]') as HTMLInputElement
    const emailInput = container.querySelector('input[name="email"]') as HTMLInputElement  
    const passwordInput = container.querySelector('input[name="password"]') as HTMLInputElement
    const confirmPasswordInput = container.querySelector('input[name="confirmPassword"]') as HTMLInputElement
    
    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'existing@example.com')
    await user.type(passwordInput, 'weak')
    await user.type(confirmPasswordInput, 'weak')
    
    const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement
    await user.click(submitButton)
    
    // Attendre que l'erreur soit affichée
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Vérifier que l'erreur est affichée
    expect(container.textContent).toContain('Email déjà utilisé')
  })

  it('gère la connexion Google', async () => {
    const user = userEvent.setup()
    
    const { container } = render(<SignupForm callbackUrl="/custom-dashboard" />)
    
    const googleButton = container.querySelector('button[type="button"]') as HTMLButtonElement
    await user.click(googleButton)
    
    expect(mockSignIn).toHaveBeenCalledWith('google', {
      callbackUrl: '/custom-dashboard',
    })
  })
}) 