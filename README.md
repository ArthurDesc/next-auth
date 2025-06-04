# Next.js + NextAuth.js v5 + Prisma + PostgreSQL

Un projet moderne de démarrage avec Next.js 15, NextAuth.js v5 (beta), Prisma ORM et PostgreSQL. Configuration complète pour l'authentification et la gestion de base de données en 2025.

## 🚀 Technologies utilisées

- **Next.js 15** - Framework React avec App Router
- **NextAuth.js v5** - Authentification (version beta)
- **Prisma** - ORM moderne pour la base de données
- **PostgreSQL** - Base de données relationnelle
- **TypeScript** - Typage statique
- **Tailwind CSS v4** - Framework CSS moderne
- **ESLint** - Linting et qualité du code

## 📋 Prérequis

- Node.js 18.0+ 
- npm, yarn, ou pnpm
- PostgreSQL 12+ (local ou distant)

## ⚙️ Installation

### 1. Cloner et installer les dépendances

```bash
git clone <votre-repo>
cd next-auth
npm install
```

### 2. Configuration de la base de données

1. **Créer une base de données PostgreSQL**
   ```sql
   CREATE DATABASE next_auth_db;
   ```

2. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env
   ```

3. **Mettre à jour le fichier `.env`**
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/next_auth_db?schema=public"
   
   # NextAuth.js v5
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here-generate-a-strong-one"
   
   # OAuth Providers (optionnel)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   ```

### 3. Configuration Prisma

```bash
# Générer le client Prisma
npm run db:generate

# Créer et appliquer les migrations
npm run db:migrate

# (Optionnel) Seed la base de données
npm run db:seed
```

## 🛠️ Scripts disponibles

### Développement
```bash
npm run dev          # Démarrer le serveur de développement
npm run build        # Build de production
npm run start        # Démarrer en production
```

### Base de données
```bash
npm run db:generate  # Générer le client Prisma
npm run db:push      # Push le schema vers la DB (développement)
npm run db:migrate   # Créer et appliquer les migrations
npm run db:studio    # Ouvrir Prisma Studio
npm run db:reset     # Reset la base de données
npm run db:seed      # Seed la base de données
```

### Qualité du code
```bash
npm run lint         # Linter le code
npm run lint:fix     # Corriger automatiquement les erreurs de lint
npm run type-check   # Vérifier les types TypeScript
npm run check        # Vérification complète (types + lint + prisma)
```

## 📁 Structure du projet

```
├── prisma/
│   ├── schema.prisma      # Schema de base de données
│   └── seed.ts           # Script de seeding
├── src/
│   ├── app/              # App Router Next.js 15
│   │   ├── api/auth/     # Routes API NextAuth
│   │   └── page.tsx      # Page d'accueil
│   ├── components/       # Composants React
│   │   ├── auth/         # Composants d'authentification
│   │   ├── ui/           # Composants UI réutilisables
│   │   └── layout/       # Composants de mise en page
│   ├── lib/
│   │   ├── db.ts         # Configuration Prisma
│   │   └── utils.ts      # Utilitaires
│   └── types/
│       └── next-auth.d.ts # Types NextAuth personnalisés
├── auth.ts               # Configuration NextAuth.js v5
├── middleware.ts         # Middleware NextAuth
└── .env                  # Variables d'environnement
```

## 🔐 Configuration NextAuth.js v5

### Providers configurés

1. **GitHub OAuth**
2. **Google OAuth** 
3. **Credentials** (email/password)

### Configuration actuelle

⚠️ **Note importante** : NextAuth.js v5 est actuellement en version beta. La configuration dans `auth.ts` est temporairement commentée en attente de la stabilisation de l'API.

Pour réactiver NextAuth.js v5 :
1. Décommentez le code dans `auth.ts`
2. Ajustez la configuration selon la documentation officielle
3. Configurez vos providers OAuth dans `.env`

## 🗄️ Base de données

### Schema Prisma

Le projet inclut un schema Prisma complet pour NextAuth.js avec :
- **User** - Utilisateurs
- **Account** - Comptes OAuth liés
- **Session** - Sessions utilisateur
- **VerificationToken** - Tokens de vérification

### Migrations

```bash
# Créer une nouvelle migration
npm run db:migrate

# Appliquer les migrations en production
npx prisma migrate deploy
```

## 🎨 Styles et UI

- **Tailwind CSS v4** configuré avec PostCSS
- Composants UI de base dans `src/components/ui/`
- Classes utilitaires personnalisées dans `src/lib/utils.ts`

## 🔍 Vérifications et tests

### Commandes de vérification

```bash
# Vérification TypeScript
npm run type-check

# Vérification ESLint  
npm run lint

# Validation schema Prisma
npx prisma validate

# Vérification complète
npm run check
```

### Compatibilité des versions

Le projet utilise les dernières versions compatibles :
- Next.js 15.3.3
- NextAuth.js 5.0.0-beta.28
- Prisma 6.9.0
- React 19.0.0

## 🚀 Déploiement

### Variables d'environnement de production

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://votre-domaine.com"
NEXTAUTH_SECRET="votre-secret-ultra-securise"
```

### Platforms supportées

- **Vercel** (recommandé)
- **Netlify**
- **Docker**
- **Serveurs traditionnels**

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

- [Documentation Next.js 15](https://nextjs.org/docs)
- [Documentation NextAuth.js v5](https://authjs.dev/)
- [Documentation Prisma](https://www.prisma.io/docs/)
- [Issues GitHub](https://github.com/votre-repo/issues)

---

**Bon développement ! 🎉**
