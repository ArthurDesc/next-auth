# Next.js + NextAuth.js v4 + Prisma + PostgreSQL

Un projet moderne d'authentification avec Next.js 15, NextAuth.js v4, Prisma ORM et PostgreSQL. Configuration complète pour l'authentification et la gestion de base de données en 2025.

## 🚀 Technologies utilisées

- **Next.js 15.3.3** - Framework React avec App Router
- **NextAuth.js v4.24.11** - Authentification complète
- **Prisma 6.9.0** - ORM moderne pour la base de données
- **PostgreSQL** - Base de données relationnelle
- **TypeScript** - Typage statique
- **Tailwind CSS v4** - Framework CSS moderne
- **ESLint** - Linting et qualité du code
- **Jest** - Tests unitaires et d'intégration

## 📋 Prérequis

- **Node.js 18.0+** 
- **npm**, yarn, ou pnpm
- **PostgreSQL 12+** (local ou distant)

## ⚙️ Installation complète

### 1. Cloner le projet et installer les dépendances

```bash
git clone <votre-repo>
cd next-auth
npm install
```

### 2. Configuration de la base de données PostgreSQL

**Créer une base de données PostgreSQL :**
```sql
-- Connectez-vous à PostgreSQL
psql -U postgres

-- Créer la base de données
CREATE DATABASE next_auth_db;

-- Vérifier la création
\l
```

### 3. Configuration des variables d'environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env
```

**Éditer le fichier `.env` avec vos paramètres :**
```env
# Database - Remplacez par vos informations
DATABASE_URL="postgresql://username:password@localhost:5432/next_auth_db?schema=public"

# NextAuth.js v4
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-a-strong-one"

# OAuth Providers (optionnel)
# Décommentez et configurez les providers que vous voulez utiliser

# Google OAuth
# GOOGLE_CLIENT_ID="your-google-client-id"
# GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth
# GITHUB_CLIENT_ID="your-github-client-id"
# GITHUB_CLIENT_SECRET="your-github-client-secret"

# Discord OAuth (exemple)
# DISCORD_CLIENT_ID="your-discord-client-id"
# DISCORD_CLIENT_SECRET="your-discord-client-secret"
```

### 4. Configuration Prisma et base de données

```bash
# 1. Générer le client Prisma
npm run db:generate

# 2. Appliquer les migrations (crée les tables)
npm run db:migrate

# 3. (Optionnel) Configurer la base avec des données de test
npm run db:setup

# 4. Vérifier la connexion à la base de données
npm run db:test
```

### 5. Vérification de l'installation

```bash
# Vérifier que tout est correctement configuré
npm run verify-setup

# Vérifications complètes (types + lint + prisma)
npm run check
```

### 6. Démarrer le projet

```bash
# Serveur de développement
npm run dev

# Ou avec Turbopack (plus rapide)
npm run dev:turbo
```

Le projet sera accessible sur **http://localhost:3000**

## 🛠️ Scripts disponibles

### **Développement**
```bash
npm run dev              # Serveur de développement (port 3000)
npm run dev:turbo        # Serveur avec Turbopack (plus rapide)
npm run build            # Build de production
npm run start            # Démarrer en mode production
```

### **Base de données**
```bash
npm run db:generate      # Générer le client Prisma
npm run db:push          # Push le schema vers la DB (développement)
npm run db:migrate       # Créer et appliquer les migrations
npm run db:studio        # Ouvrir Prisma Studio (interface graphique)
npm run db:reset         # Reset complètement la base de données
npm run db:seed          # Insérer des données de test
npm run db:setup         # Configuration automatique avec utilisateur test
npm run db:test          # Tester la connexion à la base de données
```

### **Qualité du code**
```bash
npm run lint             # Analyser le code avec ESLint
npm run lint:fix         # Corriger automatiquement les erreurs ESLint
npm run type-check       # Vérifier les types TypeScript
npm run check            # Vérification complète (types + lint + prisma)
```

### **Tests**
```bash
npm run test             # Lancer tous les tests unitaires
npm run test:watch       # Tests en mode watch
npm run test:coverage    # Tests avec couverture de code
npm run test:api         # Tests API uniquement
npm run test:api:watch   # Tests API en mode watch
npm run test:all         # Tous les tests (unitaires + API)
```

### **Vérification et maintenance**
```bash
npm run verify-setup     # Vérifier la configuration complète du projet
npm run postinstall      # Générer automatiquement le client Prisma (après npm install)
```

## 📁 Structure du projet

```
next-auth/
├── prisma/
│   ├── schema.prisma           # Schema de base de données
│   ├── seed.ts                 # Script de seeding
│   └── migrations/             # Migrations de la base de données
├── scripts/
│   ├── setup-db.js            # Configuration automatique de la DB
│   ├── test-db.js             # Test de connexion DB
│   └── verify-setup.js        # Vérification de la configuration
├── src/
│   ├── app/                   # App Router Next.js 15
│   │   ├── api/
│   │   │   ├── auth/          # Routes API NextAuth
│   │   │   │   ├── [...nextauth]/ # Configuration NextAuth
│   │   │   │   └── signup/    # API d'inscription
│   │   │   └── user/          # APIs utilisateur (profil, mot de passe)
│   │   ├── auth/              # Pages d'authentification
│   │   ├── dashboard/         # Pages dashboard
│   │   └── profile/           # Pages profil
│   ├── components/
│   │   ├── auth/              # Composants d'authentification
│   │   ├── ui/                # Composants UI réutilisables (shadcn/ui)
│   │   └── layout/            # Composants de mise en page
│   ├── hooks/                 # Hooks React personnalisés
│   ├── lib/
│   │   ├── db.ts              # Configuration Prisma optimisée
│   │   └── services/          # Services métier
│   ├── providers/             # Providers React (Auth, Theme, etc.)
│   └── types/
│       └── next-auth.d.ts     # Types NextAuth personnalisés
├── auth.ts                    # Configuration NextAuth.js v4
├── middleware.ts              # Middleware NextAuth
├── components.json            # Configuration shadcn/ui
├── jest.config.js             # Configuration Jest (tests unitaires)
├── jest.config.api.js         # Configuration Jest (tests API)
└── .env                       # Variables d'environnement
```

## 🔐 Configuration NextAuth.js v4

### **Providers configurés**

1. **Google OAuth** - Connexion via Google
2. **Credentials** - Email/mot de passe local
3. Support prêt pour GitHub, Discord, etc.

### **Fonctionnalités incluses**

- ✅ Authentification par email/mot de passe
- ✅ OAuth (Google ready)
- ✅ Sessions JWT sécurisées
- ✅ Adapter Prisma pour la persistance
- ✅ Pages d'authentification personnalisées
- ✅ Middleware de protection des routes
- ✅ API d'inscription complète
- ✅ Gestion des profils utilisateur

### **Configuration OAuth (optionnel)**

Pour activer Google OAuth :
1. Créer un projet sur [Google Cloud Console](https://console.cloud.google.com/)
2. Activer Google+ API
3. Créer des identifiants OAuth 2.0
4. Ajouter les variables dans `.env` :
   ```env
   GOOGLE_CLIENT_ID="votre-client-id"
   GOOGLE_CLIENT_SECRET="votre-client-secret"
   ```

## 🗄️ Base de données

### **Schema Prisma**

Le projet inclut un schema Prisma complet pour NextAuth.js avec :
- **User** - Utilisateurs avec profils étendus
- **Account** - Comptes OAuth liés aux utilisateurs
- **Session** - Sessions utilisateur actives
- **VerificationToken** - Tokens de vérification email

### **Migrations**

```bash
# Créer une nouvelle migration après modification du schema
npm run db:migrate

# Appliquer les migrations en production
npx prisma migrate deploy

# Visualiser la base de données
npm run db:studio
```

### **Utilisateur de test**

Après `npm run db:setup`, un utilisateur de test est créé :
- **Email** : `test@example.com`
- **Mot de passe** : `password123`

## 🎨 Interface utilisateur

- **Tailwind CSS v4** avec PostCSS
- **shadcn/ui** - Composants UI modernes et accessibles
- **Lucide React** - Icônes cohérentes
- **Thèmes dark/light** avec next-themes
- **Responsive design** par défaut

## 🧪 Tests

### **Configuration complète**

- **Jest** pour les tests unitaires et d'intégration
- **Testing Library** pour les tests de composants React
- **Supertest** pour les tests d'API
- **Configuration séparée** pour tests unitaires et API

### **Commandes de test**

```bash
# Tests de développement
npm run test:watch        # Mode watch pour développement
npm run test:coverage     # Avec rapport de couverture

# Tests de CI/CD
npm run test:all          # Tous les tests pour intégration continue
```

## 🔍 Dépannage

### **Problèmes courants**

**1. Erreur de connexion à la base de données :**
```bash
# Vérifier PostgreSQL
sudo systemctl status postgresql  # Linux
brew services list | grep postgres  # macOS

# Tester la connexion
npm run db:test
```

**2. Erreurs Prisma :**
```bash
# Régénérer le client
npm run db:generate

# Reset complet si nécessaire
npm run db:reset
```

**3. Erreurs NextAuth :**
```bash
# Vérifier les variables d'environnement
npm run verify-setup

# Vérifier la configuration
cat .env
```

### **Commandes de diagnostic**

```bash
# Vérification complète du projet
npm run verify-setup

# Test de la base de données
npm run db:test

# Vérifications de code
npm run check
```

## 🚀 Déploiement

### **Variables d'environnement de production**

```env
# Base de données (utilisez un service géré)
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# NextAuth (IMPORTANT: changez ces valeurs)
NEXTAUTH_URL="https://votre-domaine.com"
NEXTAUTH_SECRET="votre-secret-ultra-securise-minimum-32-caracteres"

# OAuth (si configuré)
GOOGLE_CLIENT_ID="prod-google-client-id"
GOOGLE_CLIENT_SECRET="prod-google-client-secret"
```

### **Platforms supportées**

- **Vercel** (recommandé) - Configuration automatique
- **Railway** - Base de données PostgreSQL incluse
- **PlanetScale** - Base de données MySQL compatible
- **Docker** - Avec docker-compose.yml inclus
- **Serveurs traditionnels** (VPS, etc.)

### **Commandes de déploiement**

```bash
# Build de production
npm run build

# Démarrage en production
npm run start

# Migrations en production
npx prisma migrate deploy
```

## 📚 Documentation et ressources

- [Documentation Next.js 15](https://nextjs.org/docs)
- [Documentation NextAuth.js v4](https://next-auth.js.org/)
- [Documentation Prisma](https://www.prisma.io/docs/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add: AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**Bon développement ! 🎉**

*Projet créé et maintenu en 2025*
