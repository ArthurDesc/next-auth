"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Navbar } from "@/components/layout/navbar"
import { RouteGuard } from "@/components/auth/route-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, User, Camera, Eye, EyeOff, Upload } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

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
  const [imageFile, setImageFile] = useState<File | null>(null)

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
        alert('Veuillez sélectionner un fichier image valide.')
        return
      }
      
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image doit faire moins de 5MB.')
        return
      }
      
      setImageFile(file)
      
      // Créer une preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validation des mots de passe
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        alert("Les nouveaux mots de passe ne correspondent pas.")
        setIsLoading(false)
        return
      }

      if (formData.newPassword && !formData.currentPassword) {
        alert("Veuillez saisir votre mot de passe actuel pour en définir un nouveau.")
        setIsLoading(false)
        return
      }

      // TODO: Appeler l'API pour mettre à jour les données utilisateur
      console.log("Données à sauvegarder:", {
        name: formData.name,
        email: formData.email,
        hasPasswordChange: !!formData.newPassword,
        hasImageChange: !!imageFile
      })
      
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mettre à jour la session
      await update({
        ...session,
        user: {
          ...session?.user,
          name: formData.name,
          email: formData.email,
          image: profileImage || session?.user?.image,
        }
      })

      // Réinitialiser les champs de mot de passe
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))

      alert("Profil mis à jour avec succès !")
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      alert("Une erreur est survenue lors de la sauvegarde.")
    } finally {
      setIsLoading(false)
    }
  }

  const getProviderLabel = (): string => {
    const provider = (session?.user as { provider?: string })?.provider
    switch (provider) {
      case "google":
        return "Google"
      case "credentials":
      case "local":
        return "Local"
      default:
        return "Inconnu"
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
                      <p>Cliquez sur l'icône pour changer votre photo</p>
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
                  <h3 className="text-lg font-medium">Changer le mot de passe</h3>
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
                        className="w-full pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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