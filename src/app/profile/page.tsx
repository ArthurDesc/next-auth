"use client"

import { useState, useMemo } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Navbar } from "@/components/layout/navbar"
import { RouteGuard } from "@/components/auth/route-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Save, User, Camera, Eye, EyeOff, Check, X, Shield, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { UserService } from "@/lib/services"
import { cn } from "@/lib/utils"

// Types pour l'évaluation de la sécurité du mot de passe
interface PasswordStrength {
  score: number
  feedback: string[]
  color: string
  label: string
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(session?.user?.image || null)

  // Fonction pour évaluer la force du mot de passe
  const evaluatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0
    const feedback: string[] = []

    if (password.length === 0) {
      return {
        score: 0,
        feedback: [],
        color: "bg-gray-200 dark:bg-gray-700",
        label: ""
      }
    }

    // Longueur
    if (password.length >= 8) {
      score += 20
    } else {
      feedback.push("Au moins 8 caractères")
    }

    if (password.length >= 12) {
      score += 10
    }

    // Minuscules
    if (/[a-z]/.test(password)) {
      score += 15
    } else {
      feedback.push("Une lettre minuscule")
    }

    // Majuscules
    if (/[A-Z]/.test(password)) {
      score += 15
    } else {
      feedback.push("Une lettre majuscule")
    }

    // Chiffres
    if (/\d/.test(password)) {
      score += 15
    } else {
      feedback.push("Un chiffre")
    }

    // Caractères spéciaux
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 20
    } else {
      feedback.push("Un caractère spécial (!@#$%^&*)")
    }

    // Diversité des caractères
    if (password.length > 0 && new Set(password).size / password.length > 0.7) {
      score += 5
    }

    // Déterminer la couleur et le label
    let color: string
    let label: string

    if (score < 30) {
      color = "bg-red-500"
      label = "Très faible"
    } else if (score < 50) {
      color = "bg-orange-500"
      label = "Faible"
    } else if (score < 70) {
      color = "bg-yellow-500"
      label = "Moyen"
    } else if (score < 85) {
      color = "bg-blue-500"
      label = "Fort"
    } else {
      color = "bg-green-500"
      label = "Très fort"
    }

    return {
      score: Math.min(score, 100),
      feedback,
      color,
      label
    }
  }

  // Mémoriser l'évaluation du mot de passe pour éviter les recalculs
  const passwordStrength = useMemo(() => 
    evaluatePasswordStrength(formData.newPassword), 
    [formData.newPassword]
  )

  // Vérifier si les mots de passe correspondent
  const passwordsMatch = formData.newPassword === formData.confirmPassword && formData.confirmPassword.length > 0

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-app">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-app">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Non connecté</p>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner un fichier image valide.')
        return
      }
      
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('L\'image doit faire moins de 5MB.')
        return
      }
      
      // Créer une preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      
      toast.success('Image sélectionnée avec succès')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validation des mots de passe
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        toast.error("Les nouveaux mots de passe ne correspondent pas.")
        setIsLoading(false)
        return
      }

      if (formData.newPassword && !formData.currentPassword) {
        toast.error("Veuillez saisir votre mot de passe actuel pour en définir un nouveau.")
        setIsLoading(false)
        return
      }

      // Vérifier la force du mot de passe
      if (formData.newPassword && passwordStrength.score < 50) {
        toast.error("Le nouveau mot de passe n'est pas assez sécurisé. Veuillez choisir un mot de passe plus fort.")
        setIsLoading(false)
        return
      }

      let profileUpdateSuccess = true
      let passwordUpdateSuccess = true

      // Mise à jour des informations de profil (nom et email)
      if (formData.name !== session?.user?.name || formData.email !== session?.user?.email) {
        const profileData: { name?: string; email?: string } = {}
        if (formData.name !== session?.user?.name) profileData.name = formData.name
        if (formData.email !== session?.user?.email) profileData.email = formData.email

        toast.loading('Mise à jour du profil...', { id: 'profile-update' })

        const profileResult = await UserService.updateProfile(profileData)
        
        if (!profileResult.success) {
          toast.error(profileResult.error || "Erreur lors de la mise à jour du profil", { id: 'profile-update' })
          setIsLoading(false)
          return
        }

        toast.success('Profil mis à jour avec succès', { id: 'profile-update' })
        profileUpdateSuccess = true
      }

      // Changement de mot de passe (si demandé)
      if (formData.newPassword && formData.currentPassword) {
        toast.loading('Changement du mot de passe...', { id: 'password-update' })

        const passwordResult = await UserService.changePassword({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })

        if (!passwordResult.success) {
          toast.error(passwordResult.error || "Erreur lors du changement de mot de passe", { id: 'password-update' })
          setIsLoading(false)
          return
        }

        toast.success('Mot de passe mis à jour avec succès', { id: 'password-update' })
        passwordUpdateSuccess = true
      }

      // Mettre à jour la session avec les nouvelles données
      if (profileUpdateSuccess) {
        await update({
          ...session,
          user: {
            ...session?.user,
            name: formData.name,
            email: formData.email,
            image: profileImage || session?.user?.image,
          }
        })
      }

      // Réinitialiser les champs de mot de passe
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))

      // Message de succès global
      if (profileUpdateSuccess && passwordUpdateSuccess) {
        if (formData.newPassword) {
          toast.success("Toutes les modifications ont été sauvegardées !", {
            description: "Votre profil et mot de passe ont été mis à jour."
          })
        } else {
          toast.success("Profil sauvegardé !", {
            description: "Vos informations ont été mises à jour avec succès."
          })
        }
      }

    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      toast.error("Une erreur est survenue lors de la sauvegarde.", {
        description: "Veuillez réessayer dans quelques instants."
      })
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <RouteGuard requireAuth={true}>
      <div className="min-h-screen bg-gradient-app">
        <Navbar />
        
        <div className="container mx-auto py-8 px-4 max-w-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mon profil</h1>
              <p className="text-muted-foreground">Gérez vos informations personnelles</p>
            </div>
          </div>

          {/* Formulaire de profil */}
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Modifiez vos informations de compte. Les changements seront sauvegardés automatiquement.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Photo de profil */}
                <div className="space-y-4">
                  <Label>Photo de profil</Label>
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Photo de profil"
                          className="w-20 h-20 rounded-full object-cover border-2 border-border"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-border">
                          <User className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <label
                        htmlFor="profile-image"
                        className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                      >
                        <Camera className="w-4 h-4 text-primary-foreground" />
                      </label>
                      <input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Cliquez sur l&apos;icône pour changer votre photo</p>
                      <p>Formats acceptés: JPG, PNG, GIF (max 5MB)</p>
                    </div>
                  </div>
                </div>

                {/* Informations personnelles */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Informations personnelles</h3>
                  
                  {/* Nom */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Votre nom complet"
                      className="w-full"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Adresse email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="votre.email@exemple.com"
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Modification du mot de passe */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Changer le mot de passe</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Laissez vide si vous ne souhaitez pas modifier votre mot de passe
                  </p>
                  
                  {/* Mot de passe actuel */}
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        placeholder="Votre mot de passe actuel"
                        className="w-full pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Nouveau mot de passe */}
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        placeholder="Nouveau mot de passe"
                        className="w-full pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* Indicateur de force du mot de passe */}
                    {formData.newPassword && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Force du mot de passe:</span>
                          <span className={cn(
                            "text-sm font-medium",
                            passwordStrength.score < 30 && "text-red-600 dark:text-red-400",
                            passwordStrength.score >= 30 && passwordStrength.score < 50 && "text-orange-600 dark:text-orange-400",
                            passwordStrength.score >= 50 && passwordStrength.score < 70 && "text-yellow-600 dark:text-yellow-400",
                            passwordStrength.score >= 70 && passwordStrength.score < 85 && "text-blue-600 dark:text-blue-400",
                            passwordStrength.score >= 85 && "text-green-600 dark:text-green-400"
                          )}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <Progress 
                          value={passwordStrength.score} 
                          className="h-2"
                        />
                        
                        {/* Conseils d'amélioration */}
                        {passwordStrength.feedback.length > 0 && (
                          <div className="bg-muted/50 dark:bg-muted/30 p-3 rounded-lg">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                  Pour améliorer la sécurité, ajoutez :
                                </p>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  {passwordStrength.feedback.map((item, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                      <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Confirmer le nouveau mot de passe */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirmer le nouveau mot de passe"
                        className={cn(
                          "w-full pr-10",
                          formData.confirmPassword.length > 0 && (
                            passwordsMatch 
                              ? "border-green-500 focus:border-green-500 dark:border-green-400" 
                              : "border-red-500 focus:border-red-500 dark:border-red-400"
                          )
                        )}
                      />
                      <div className="absolute right-0 top-0 h-full flex items-center gap-1 px-3">
                        {formData.confirmPassword.length > 0 && (
                          passwordsMatch ? (
                            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                          )
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {/* Message de correspondance */}
                    {formData.confirmPassword.length > 0 && (
                      <p className={cn(
                        "text-sm",
                        passwordsMatch 
                          ? "text-green-600 dark:text-green-400" 
                          : "text-red-600 dark:text-red-400"
                      )}>
                        {passwordsMatch ? "Les mots de passe correspondent" : "Les mots de passe ne correspondent pas"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isLoading ? "Sauvegarde..." : "Sauvegarder"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard")}
                    disabled={isLoading}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </RouteGuard>
  )
} 