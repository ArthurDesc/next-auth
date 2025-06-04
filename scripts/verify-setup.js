#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de la configuration du projet...\n');

const checks = [
  {
    name: 'Next.js 15 configuré',
    check: () => {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return packageJson.dependencies.next && packageJson.dependencies.next.startsWith('15');
    }
  },
  {
    name: 'TypeScript configuré',
    check: () => fs.existsSync('tsconfig.json')
  },
  {
    name: 'Tailwind CSS configuré',
    check: () => {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return packageJson.devDependencies.tailwindcss;
    }
  },
  {
    name: 'Prisma configuré',
    check: () => fs.existsSync('prisma/schema.prisma')
  },
  {
    name: 'Client Prisma généré',
    check: () => fs.existsSync('src/generated/prisma')
  },
  {
    name: 'NextAuth.js v5 installé',
    check: () => {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return packageJson.devDependencies['next-auth'] && packageJson.devDependencies['next-auth'].includes('beta');
    }
  },
  {
    name: 'Variables d\'environnement',
    check: () => fs.existsSync('.env') && fs.existsSync('.env.example')
  },
  {
    name: 'Middleware NextAuth',
    check: () => fs.existsSync('middleware.ts')
  },
  {
    name: 'Routes API NextAuth',
    check: () => fs.existsSync('src/app/api/auth/[...nextauth]/route.ts')
  },
  {
    name: 'ESLint configuré',
    check: () => fs.existsSync('eslint.config.mjs')
  }
];

let allPassed = true;

checks.forEach(({ name, check }) => {
  const passed = check();
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${name}`);
  if (!passed) allPassed = false;
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('🎉 Configuration complète ! Votre projet est prêt.\n');
  console.log('📋 Étapes suivantes :');
  console.log('1. Configurer votre base de données PostgreSQL');
  console.log('2. Mettre à jour le fichier .env avec vos variables');
  console.log('3. Lancer les migrations : npm run db:migrate');
  console.log('4. Démarrer le serveur : npm run dev');
  console.log('\n🔧 Note : NextAuth.js v5 nécessite une configuration manuelle');
  console.log('   Décommentez le code dans auth.ts une fois la doc stabilisée');
} else {
  console.log('⚠️  Certains éléments nécessitent votre attention.');
}

console.log('\n📚 Consultez le README.md pour plus de détails.'); 