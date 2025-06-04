# Guide de Démarrage - Authentification NextAuth v5

## 🚀 Configuration Rapide

### 1. Configuration de la Base de Données

1. **Configurer PostgreSQL** (ou votre base de données préférée)
2. **Modifier `.env.local`** avec vos informations de connexion :
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/next_auth_db?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-clé-secrète-très-sécurisée"
```

3. **Appliquer le schéma de base de données** :
```bash
npm run db:push
```

4. **Tester la connexion** :
```bash
npm run db:test
```

5. **Créer un utilisateur de test** :
```bash
npm run db:setup
```

### 2. Configuration Google OAuth (Optionnel)

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un nouveau projet ou sélectionner un projet existant
3. Activer l'API Google+ 
4. Créer des identifiants OAuth 2.0
5. Ajouter `http://localhost:3000/api/auth/callback/google` aux URI de redirection
6. Décommenter et configurer dans `.env.local` :
```bash
GOOGLE_CLIENT_ID="votre-google-client-id"
GOOGLE_CLIENT_SECRET="votre-google-client-secret"
```

### 3. Démarrer l'Application

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

## 🔐 Fonctionnalités Disponibles

### Authentification Locale
- **Inscription** : `/auth/signup`
- **Connexion** : `/auth/signin`
- Validation des données avec Zod
- Hachage sécurisé des mots de passe avec bcrypt

### Authentification OAuth
- **Google** : Connexion avec votre compte Google
- Création automatique de compte
- Synchronisation des informations utilisateur

### Gestion des Sessions
- Sessions JWT sécurisées
- Middleware de protection des routes
- Redirection automatique

### Pages et Routes

#### Pages Publiques
- `/` - Page d'accueil
- `/auth/signin` - Connexion
- `/auth/signup` - Inscription

#### Pages Protégées
- `/dashboard` - Tableau de bord utilisateur (nécessite une connexion)

## 🛠️ Architecture

### Structure des Fichiers
```
src/
├── app/
│   ├── auth/
│   │   ├── signin/page.tsx     # Page de connexion
│   │   └── signup/page.tsx     # Page d'inscription
│   ├── dashboard/page.tsx      # Dashboard protégé
│   └── api/auth/
│       ├── signup/route.ts     # API d'inscription
│       └── [...nextauth]/route.ts  # Routes NextAuth
├── components/auth/
│   ├── signin-form.tsx         # Composant de connexion
│   ├── signup-form.tsx         # Composant d'inscription
│   └── user-menu.tsx           # Menu utilisateur
├── providers/
│   └── session-provider.tsx    # Provider de session
└── types/
    └── next-auth.d.ts          # Types TypeScript

auth.ts                         # Configuration NextAuth
middleware.ts                   # Middleware de protection
```

### Base de Données (Prisma)
- **User** : Utilisateurs avec support OAuth et local
- **Account** : Comptes OAuth liés
- **Session** : Sessions actives
- **VerificationToken** : Tokens de vérification

## 🧪 Test de l'Application

### Compte de Test Créé
- **Email** : `test@example.com`
- **Mot de passe** : `password123`

### Scénarios de Test

1. **Inscription locale** :
   - Aller sur `/auth/signup`
   - Créer un nouveau compte
   - Connexion automatique

2. **Connexion locale** :
   - Aller sur `/auth/signin`
   - Utiliser le compte de test
   - Redirection vers `/dashboard`

3. **Google OAuth** (si configuré) :
   - Cliquer sur "Continuer avec Google"
   - Autoriser l'application
   - Création/connexion automatique

4. **Protection des routes** :
   - Essayer d'accéder à `/dashboard` sans être connecté
   - Redirection automatique vers `/auth/signin`

## 🔧 Commandes Utiles

```bash
# Développement
npm run dev                     # Démarre le serveur de développement
npm run type-check             # Vérification TypeScript
npm run lint                   # Linting du code

# Base de données
npm run db:generate            # Génère le client Prisma
npm run db:push               # Applique le schéma à la DB
npm run db:studio             # Interface web Prisma
npm run db:test               # Test de connexion
npm run db:setup              # Configuration initiale

# Build
npm run build                 # Build de production
npm run start                 # Démarre la production
```

## 🚨 Sécurité

### Variables d'Environnement
- Ne jamais committer `.env.local`
- Utiliser des clés secrètes fortes
- Changer `NEXTAUTH_SECRET` en production

### Mots de Passe
- Hachage avec bcrypt (12 rounds)
- Validation côté client et serveur
- Pas de stockage en clair

### Sessions
- JWT sécurisés
- Expiration automatique
- Protection CSRF intégrée

## 🐛 Dépannage

### Erreurs Communes

1. **Erreur de base de données** :
   - Vérifier que PostgreSQL est démarré
   - Valider l'URL de connexion
   - Exécuter `npm run db:push`

2. **Erreur OAuth Google** :
   - Vérifier les credentials
   - Valider les URI de redirection
   - S'assurer que l'API est activée

3. **Erreurs de session** :
   - Vérifier `NEXTAUTH_SECRET`
   - Vider les cookies du navigateur
   - Redémarrer le serveur

### Logs de Debug
Les logs détaillés sont disponibles dans la console du serveur pour diagnostiquer les problèmes d'authentification.

## 📚 Documentation Supplémentaire

- [NextAuth.js v5](https://authjs.dev/)
- [Prisma](https://www.prisma.io/docs/)
- [Next.js](https://nextjs.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs/) 