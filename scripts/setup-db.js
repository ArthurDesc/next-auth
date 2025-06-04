const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

async function setupDatabase() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔄 Configuration de la base de données...')
    
    // Créer un utilisateur de test si il n'existe pas
    const testEmail = 'test@example.com'
    const existingUser = await prisma.user.findUnique({
      where: { email: testEmail }
    })
    
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('password123', 12)
      
      const testUser = await prisma.user.create({
        data: {
          name: 'Utilisateur Test',
          email: testEmail,
          password_hash: hashedPassword,
          provider: 'local',
        }
      })
      
      console.log('✅ Utilisateur de test créé :')
      console.log(`   Email: ${testUser.email}`)
      console.log(`   Mot de passe: password123`)
      console.log(`   ID: ${testUser.id}`)
    } else {
      console.log('👤 Utilisateur de test existe déjà')
    }
    
    // Afficher les statistiques
    const totalUsers = await prisma.user.count()
    const localUsers = await prisma.user.count({ where: { provider: 'local' } })
    const googleUsers = await prisma.user.count({ where: { provider: 'google' } })
    
    console.log('\n📊 Statistiques de la base de données :')
    console.log(`   Total utilisateurs: ${totalUsers}`)
    console.log(`   Utilisateurs locaux: ${localUsers}`)
    console.log(`   Utilisateurs Google: ${googleUsers}`)
    
    console.log('\n🎉 Configuration terminée !')
    
  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

setupDatabase() 