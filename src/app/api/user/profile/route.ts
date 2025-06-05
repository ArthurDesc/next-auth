import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

// Schéma de validation pour la mise à jour du profil
const updateProfileSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").optional(),
  email: z.string().email("Format d'email invalide").optional(),
})

export async function PUT(request: NextRequest) {
  try {
    // Vérification de l'authentification
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validation des données
    const validatedFields = updateProfileSchema.safeParse(body)
    
    if (!validatedFields.success) {
      return NextResponse.json(
        { 
          error: "Données invalides", 
          details: validatedFields.error.issues 
        },
        { status: 400 }
      )
    }

    const { name, email } = validatedFields.data

    // Vérifier que au moins un champ est fourni
    if (!name && !email) {
      return NextResponse.json(
        { error: "Aucune donnée à mettre à jour" },
        { status: 400 }
      )
    }

    // Si email est fourni, vérifier qu'il n'est pas déjà utilisé
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: { 
          email,
          id: { not: session.user.id }
        }
      })

      if (existingUser) {
        return NextResponse.json(
          { error: "Cet email est déjà utilisé par un autre compte" },
          { status: 409 }
        )
      }
    }

    // Mise à jour de l'utilisateur
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        updated_at: true,
      },
    })

    return NextResponse.json(
      { 
        message: "Profil mis à jour avec succès",
        user: updatedUser
      },
      { status: 200 }
    )

  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
} 