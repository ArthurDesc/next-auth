// TODO: Configuration NextAuth.js v5 à finaliser
// En attente de la documentation officielle pour NextAuth v5 beta

// import NextAuth from "next-auth"
// import { PrismaAdapter } from "@auth/prisma-adapter"
// import { PrismaClient } from "./src/generated/prisma"
// import GitHub from "next-auth/providers/github"
// import Google from "next-auth/providers/google"
// import Credentials from "next-auth/providers/credentials"

// const prisma = new PrismaClient()

// Configuration temporairement désactivée
// export const { auth, handlers, signIn, signOut } = NextAuth({...})

// Exports par défaut pour éviter les erreurs de build
export const auth = () => null
export const handlers = { GET: () => null, POST: () => null }
export const signIn = () => null
export const signOut = () => null 