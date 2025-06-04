// TODO: Configuration NextAuth.js v5 à finaliser
// En attente de la documentation officielle pour NextAuth v5 beta

import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { z } from "zod"

const prisma = new PrismaClient()

// Schéma de validation pour les credentials
const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Validation des données
          const validatedFields = credentialsSchema.safeParse(credentials)
          
          if (!validatedFields.success) {
            return null
          }

          const { email, password } = validatedFields.data

          // Recherche de l'utilisateur
          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user || !user.password_hash) {
            return null
          }

          // Vérification du mot de passe
          const isPasswordValid = await bcrypt.compare(password, user.password_hash)

          if (!isPasswordValid) {
            return null
          }

          // Retour de l'utilisateur authentifié
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.avatar_url,
          }
        } catch (error) {
          console.error("Erreur lors de l'authentification:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.provider = account?.provider || "credentials"
        token.userId = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.userId as string
        session.user.provider = token.provider as string
      }
      return session
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Vérification si l'utilisateur existe déjà
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          })

          if (!existingUser) {
            // Créer un nouvel utilisateur pour Google OAuth
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                avatar_url: user.image,
                provider: "google",
                provider_id: account.providerAccountId,
                emailVerified: new Date(),
              },
            })
          }
        } catch (error) {
          console.error("Erreur lors de la création du profil Google:", error)
          return false
        }
      }
      return true
    },
  },
}) 