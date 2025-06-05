import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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
}

const mockSignIn = signIn as jest.MockedFunction<typeof signIn>
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('SignupForm', () => {
  beforeEach(() => {
    // Reset des mocks avant chaque test
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue(mockRouter)
    
    // Mock console.error pour éviter les logs d'erreur dans les tests
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  const fillSignupForm = async (user: any, formData: {
    name: string
    email: string
    password: string
    confirmPassword: string
  }) => {
    await user.type(screen.getByLabelText(/nom complet/i), formData.name)
    await user.type(screen.getByLabelText(/email/i), formData.email)
    await user.type(screen.getByLabelText(/^mot de passe$/i), formData.password)
    await user.type(screen.getByLabelText(/confirmer le mot de passe/i), formData.confirmPassword)
  }

  it('rend le formulaire correctement', () => {
    render(<SignupForm />)
    
    expect(screen.getByText('Inscription')).toBeInTheDocument()
    expect(screen.getByLabelText(/nom complet/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^mot de passe$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirmer le mot de passe/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /créer mon compte/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /continuer avec google/i })).toBeInTheDocument()
  })

  it('valide les champs requis', async () => {
    const user = userEvent.setup()
    render(<SignupForm />)
    
    const submitButton = screen.getByRole('button', { name: /créer mon compte/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/le nom doit contenir au moins 2 caractères/i)).toBeInTheDocument()
      expect(screen.getByText(/format d'email invalide/i)).toBeInTheDocument()
      expect(screen.getByText(/le mot de passe doit contenir au moins 8 caractères/i)).toBeInTheDocument()
    })
  })

  it('valide que les mots de passe correspondent', async () => {
    const user = userEvent.setup()
    render(<SignupForm />)
    
    await fillSignupForm(user, {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'differentpassword'
    })
    
    const submitButton = screen.getByRole('button', { name: /créer mon compte/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/les mots de passe ne correspondent pas/i)).toBeInTheDocument()
    })
  })

  it('envoie les données correctes à l\'API lors de l\'inscription réussie', async () => {
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
      error: null,
      status: 200,
      url: null
    })
    
    render(<SignupForm />)
    
    const formData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    }
    
    await fillSignupForm(user, formData)
    
    const submitButton = screen.getByRole('button', { name: /créer mon compte/i })
    await user.click(submitButton)
    
    // Vérifier que fetch a été appelé avec les bonnes données
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })
    })
    
    // Vérifier que signIn a été appelé après l'inscription réussie
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })
    })
    
    // Vérifier la redirection
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
      expect(mockRouter.refresh).toHaveBeenCalled()
    })
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
    
    render(<SignupForm />)
    
    await fillSignupForm(user, {
      name: 'John Doe',
      email: 'existing@example.com',
      password: 'weak',
      confirmPassword: 'weak'
    })
    
    const submitButton = screen.getByRole('button', { name: /créer mon compte/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText("Email déjà utilisé, Mot de passe trop faible")).toBeInTheDocument()
    })
  })

  it('affiche l\'erreur pour un compte existant', async () => {
    const user = userEvent.setup()
    
    // Mock de la réponse API pour compte existant
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({
        error: 'Un compte avec cet email existe déjà'
      })
    } as Response)
    
    render(<SignupForm />)
    
    await fillSignupForm(user, {
      name: 'John Doe',
      email: 'existing@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    })
    
    const submitButton = screen.getByRole('button', { name: /créer mon compte/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText("Un compte avec cet email existe déjà")).toBeInTheDocument()
    })
  })

  it('gère les erreurs réseau', async () => {
    const user = userEvent.setup()
    
    // Mock d'une erreur réseau
    mockFetch.mockRejectedValueOnce(new Error('Network error'))
    
    render(<SignupForm />)
    
    await fillSignupForm(user, {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    })
    
    const submitButton = screen.getByRole('button', { name: /créer mon compte/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText("Une erreur est survenue lors de la création du compte")).toBeInTheDocument()
    })
  })

  it('désactive les champs pendant le chargement', async () => {
    const user = userEvent.setup()
    
    // Mock d'une réponse qui ne se résout jamais (pour capturer l'état de chargement)
    let resolvePromise: (value: any) => void
    mockFetch.mockImplementationOnce(() => 
      new Promise(resolve => {
        resolvePromise = resolve
      })
    )
    
    render(<SignupForm />)
    
    await fillSignupForm(user, {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    })
    
    const submitButton = screen.getByRole('button', { name: /créer mon compte/i })
    await user.click(submitButton)
    
    // Vérifier que les champs sont désactivés pendant le chargement
    await waitFor(() => {
      expect(screen.getByLabelText(/nom complet/i)).toBeDisabled()
      expect(screen.getByLabelText(/email/i)).toBeDisabled()
      expect(screen.getByLabelText(/^mot de passe$/i)).toBeDisabled()
      expect(screen.getByLabelText(/confirmer le mot de passe/i)).toBeDisabled()
      expect(submitButton).toBeDisabled()
      expect(screen.getByText("Création du compte...")).toBeInTheDocument()
    })
    
    // Résoudre la promesse pour nettoyer le test
    resolvePromise!({
      ok: true,
      json: async () => ({ message: 'Success' })
    } as Response)
  })

  it('gère la connexion automatique échouée après inscription réussie', async () => {
    const user = userEvent.setup()
    
    // Mock de l'inscription réussie
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: 'Compte créé avec succès',
        user: { id: '1', name: 'John Doe', email: 'john@example.com' }
      })
    } as Response)
    
    // Mock de signIn échoué
    mockSignIn.mockResolvedValueOnce({
      ok: false,
      error: 'CredentialsSignin',
      status: 401,
      url: null
    })
    
    render(<SignupForm />)
    
    await fillSignupForm(user, {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    })
    
    const submitButton = screen.getByRole('button', { name: /créer mon compte/i })
    await user.click(submitButton)
    
    // Vérifier la redirection vers la page de connexion
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/auth/signin?message=account-created')
    })
  })

  it('gère la connexion Google', async () => {
    const user = userEvent.setup()
    
    render(<SignupForm callbackUrl="/custom-dashboard" />)
    
    const googleButton = screen.getByRole('button', { name: /continuer avec google/i })
    await user.click(googleButton)
    
    expect(mockSignIn).toHaveBeenCalledWith('google', {
      callbackUrl: '/custom-dashboard',
    })
  })

  it('utilise la callbackUrl personnalisée', async () => {
    const user = userEvent.setup()
    const customCallbackUrl = '/custom-page'
    
    // Mock de l'inscription réussie
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: 'Compte créé avec succès',
        user: { id: '1', name: 'John Doe', email: 'john@example.com' }
      })
    } as Response)
    
    // Mock de signIn réussie
    mockSignIn.mockResolvedValueOnce({
      ok: true,
      error: null,
      status: 200,
      url: null
    })
    
    render(<SignupForm callbackUrl={customCallbackUrl} />)
    
    await fillSignupForm(user, {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    })
    
    const submitButton = screen.getByRole('button', { name: /créer mon compte/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(customCallbackUrl)
    })
  })
}) 