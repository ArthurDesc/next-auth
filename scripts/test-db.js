const { PrismaClient } = require('@prisma/client')

async function testDatabase() {
  const prisma = new PrismaClient()
  
  try {
    // Test simple de connexion
    await prisma.$queryRaw`SELECT 1 as result`
    console.log('✅ Connexion à la base de données réussie')
    
    // Test du schéma User
    const userCount = await prisma.user.count()
    console.log(`📊 Nombre d'utilisateurs dans la base : ${userCount}`)
    
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error.message)
    console.log('\n💡 Vérifiez que :')
    console.log('   - PostgreSQL est démarré')
    console.log('   - La base de données existe')
    console.log('   - L\'URL de connexion dans .env.local est correcte')
    console.log('   - Les migrations Prisma ont été appliquées : npm run db:push')
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase() 