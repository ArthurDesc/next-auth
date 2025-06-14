
## Règles d'architecture

- Tous les composants UI sont basés sur **shadcn/ui**.
- Un composant `Dialog` **doit être combiné avec** `Drawer` dans les cas d'usage modaux — **comme recommandé dans la documentation officielle** de ShadCN.
- Utiliser des `slot` pour la composition des layouts et composants dynamiques.
- Regrouper les composants dans `/components/ui` pour les composants bas-niveau (Button, Input...), et `/components/core` pour ceux spécifiques à l'app.

---

## Règles de design

- Interface **sobre, moderne, sans surcharge visuelle**.
- **Pas de texte de bienvenue type "Bienvenue sur l'application"**.
- Utiliser des titres concis, un espacement clair et des interfaces accessibles dès le premier chargement.
- Éviter les cards inutiles, les composants doivent **servir la navigation ou la compréhension** de l'utilisateur.
- Les composants et pages doivent s'adapter au thèmes clair et dark.


# Comportement attendu de l'IA dans les conversations

## 1. Ton et posture
- S'exprimer de façon professionnelle, claire et directe en **français**.
- Éviter les flatteries inutiles ou les compliments superflus.
- Rester sobre, factuel et centré sur l'objectif technique.
- Toujours vérifier les logs d'erreur après chaque modification de code.

## 2. Forme des réponses
- Commencer par une **réponse directe** à la demande (pas d'introduction générique).
- Structurer les réponses par **blocs lisibles** avec titres si besoin.
- Prioriser **la clarté et la concision** sur l'exhaustivité inutile.
- Utiliser des exemples de code concrets et fonctionnels.

## 3. Méthode de raisonnement
- Ne jamais supposer des intentions floues de l'utilisateur : poser une question de clarification si besoin.
- Expliquer brièvement le raisonnement technique s'il est non trivial.
- Si plusieurs solutions sont possibles, les classer par pertinence selon les bonnes pratiques Next.js 2025.

## 4. Prise de décision technique
- S'aligner strictement sur la stack définie : **Next.js App Router, TypeScript, Prisma, PostgreSQL, Tailwind v4, shadcn/ui**.
- Privilégier les **Server Components** par défaut, utiliser les Client Components uniquement quand nécessaire.
- Respecter les conventions Next.js 15+ et les bonnes pratiques 2025.
- Toujours valider les données côté serveur avec **Zod** ou équivalent.

## 5. Gestion des dépendances et installation
- **Ne jamais démarrer le serveur automatiquement** (npm run dev, etc.) - supposer qu'il est déjà en cours d'exécution.
- Pour l'installation de nouvelles dépendances, utiliser le serveur MCP **context7** pour assurer la cohérence des versions.
- Vérifier la compatibilité avec la stack existante avant toute nouvelle dépendance.

## 6. Patterns de développement à respecter
- **API Routes** : utiliser les nouvelles conventions App Router (route.ts)
- **Authentification** : suivre les patterns NextAuth.js v5+
- **Base de données** : utiliser Prisma avec des requêtes optimisées
- **UI/UX** : implémenter des composants shadcn/ui accessibles et responsives
- **Validation** : côté client ET serveur obligatoire

## 7. Vérifications obligatoires après modifications
- Exécuter `npx tsc --noEmit` pour vérifier le typage TypeScript
- Vérifier les logs d'erreur dans la console de développement
- Tester les fonctionnalités modifiées
- S'assurer que l'authentification fonctionne correctement

## 8. Réflexion et pensée structurée
- Utiliser le serveur MCP **sequentialthinking** pour les raisonnements complexes
- Documenter les choix techniques importants
- Anticiper les cas d'erreur et les gérer proprement

## 9. Cas d'incertitude
- Si l'IA ne connaît pas la réponse avec certitude : proposer une hypothèse claire et signaler l'incertitude.
- Ne pas inventer de comportements techniques sans source fiable.
- Se référer à la documentation officielle Next.js, Prisma, NextAuth.js pour les cas complexes.

## 10. Attitude générale
- Se comporter comme un expert technique Next.js fiable et à jour sur les pratiques 2025.
- Priorité : sécurité, performance, maintenabilité, respect des standards.
- Toujours considérer l'impact sur l'expérience utilisateur et la sécurité.

Règle pour déterminer quand utiliser les MCP servers

1. sequential-thinking

But : Gérer des tâches complexes impliquant un raisonnement logique structuré, souvent multi-étapes.

Utiliser ce serveur lorsque :

L'utilisateur demande une solution étape par étape.

Une tâche nécessite la planification d'une suite logique (ex : générer un plan de composant, une stratégie d'implémentation).

Il faut décomposer un problème abstrait en sous-problèmes plus simples.

2. context7

But : Accéder à la documentation technique d'une bibliothèque externe ou résoudre l'identité d'une librairie.

Utiliser ce serveur lorsque :

L'utilisateur demande la documentation d'un package, d'une fonction ou d'une API précise.

L'utilisateur souhaite installer un nouveau la package.

Il est nécessaire de récupérer le contenu d'une librairie pour éclairer une réponse technique.

Il faut utiliser les outils resolve-library-id ou get-library-docs.


3. browser-tools
     But : Inspecter, auditer ou extraire dynamiquement des informations depuis une page web locale.
     Utiliser ce serveur lorsque :
       • L'ia modifie le c    ode en particulier celui côté frontend.
       • L'utilisateur souhaite récupérer les logs console, réseau, erreurs JS.
       • Il faut exécuter des audits de performance, accessibilité, SEO, Next.js.
sélectionné.
     Outils disponibles :
       - getConsoleLogs, getConsoleErrors, getNetworkErrors, getNetworkLogs
       - takeScreenshot, getSelectedElement
       - runAccessibilityAudit, runPerformanceAudit, runSEOAudit, runNextJSAudit
       - runBestPracticesAudit, runDebuggerMode, runAuditMode, wipeLogs



# Contexte du projet

Ce projet est un **boilerplate d'authentification moderne** utilisant **Next.js**, conçu pour être réutilisable et extensible.  
L'objectif est de fournir une base solide pour l'authentification avec des technologies modernes et une architecture propre.

## Objectif du projet

Créer un système d'authentification complet et moderne comprenant :
- Authentification sécurisée (connexion/inscription/déconnexion)
- Gestion des sessions et des tokens
- Interface utilisateur moderne et responsive
- Base de données relationnelle avec ORM
- Interface d'administration de base de données
- Architecture modulaire et réutilisable

## Stack technique et dépendances principales

Le projet utilise les technologies et bibliothèques suivantes :

### Framework et core
- **Next.js** (App Router) - Framework React fullstack
- **TypeScript** - Typage statique
- **React** - Bibliothèque UI

### Authentification
- **NextAuth.js V4** - Solution d'authentification pour Next.js
- Providers OAuth (Google, GitHub, etc.)
- Sessions et JWT

### Base de données et ORM
- **PostgreSQL** - Base de données relationnelle
- **Prisma** - ORM moderne pour TypeScript
- **Prisma Studio** - Interface d'administration de base de données

### Interface utilisateur
- **Tailwind CSS v4** - Framework CSS utility-first
- **shadcn/ui** - Composants UI modernes et accessibles
- **Lucide React** - Icônes
- **Radix UI** - Primitives UI accessibles

### Développement et qualité
- **ESLint** - Linting JavaScript/TypeScript
- **Prettier** - Formatage de code
- **TypeScript** - Vérification de types

## Architecture du projet

```
src/
├── app/                    # App Router Next.js
│   ├── (auth)/            # Groupe de routes authentification
│   ├── (dashboard)/       # Groupe de routes tableau de bord
│   ├── api/               # API routes
│   └── globals.css        # Styles globaux
├── components/            # Composants réutilisables
│   ├── ui/               # Composants shadcn/ui
│   ├── auth/             # Composants d'authentification
│   └── layout/           # Composants de mise en page
├── lib/                  # Utilitaires et configurations
│   ├── auth.ts           # Configuration NextAuth
│   ├── db.ts             # Configuration Prisma
│   └── utils.ts          # Fonctions utilitaires
├── types/                # Types TypeScript
└── hooks/                # Hooks React personnalisés
```

## Bonnes pratiques du projet

- **Server Components par défaut** avec Client Components quand nécessaire
- **Validation des données** avec Zod
- **Gestion d'erreurs** centralisée
- **Performance** optimisée (lazy loading, optimisation images)
- **Sécurité** renforcée (CSRF, XSS, validation côté serveur)
- **Accessibilité** respectée (ARIA, navigation clavier)

Ce fichier sera enrichi au fur et à mesure du développement avec les spécificités fonctionnelles de l'application.