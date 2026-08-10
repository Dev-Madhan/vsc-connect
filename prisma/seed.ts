import { RoleEnum, Gender, Year } from '@prisma/client'
import { prisma } from "../lib/prisma";

async function main() {
  console.log('Seeding database...')

  // 1. Create Default Settings
  const settingsToCreate = [
    { key: 'SITE_NAME', value: 'Vistara Connect', description: 'The name of the application' },
    { key: 'ALLOW_REGISTRATION', value: 'true', description: 'Enable or disable public registration' }
  ]

  for (const s of settingsToCreate) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    })
  }
  console.log('✅ Settings seeded')

  // 2. Create Roles
  const roles = [RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.MODERATOR, RoleEnum.USER]
  for (const roleName of roles) {
    // We cannot upsert by name because name is an Enum and there is no @unique constraint on name in the schema.
    // Let's find first, if not exist, create.
    const existingRole = await prisma.role.findFirst({
      where: { name: roleName }
    })
    
    if (!existingRole) {
      await prisma.role.create({
        data: { name: roleName, description: `${roleName} role` }
      })
    }
  }
  console.log('✅ Roles seeded')

  // 3. Create Default Club & SubClub
  const club = await prisma.club.upsert({
    where: { slug: 'vistara' },
    update: {},
    create: {
      name: 'Vistara',
      slug: 'vistara',
      description: 'The main club',
    },
  })
  console.log('✅ Club seeded')

  const subClub = await prisma.subClub.upsert({
    where: { slug: 'development' },
    update: {},
    create: {
      name: 'Development',
      slug: 'development',
      clubId: club.id,
      description: 'Software Development Team'
    },
  })
  console.log('✅ SubClub seeded')

  // 4. Create Super Admin User
  // First we need the SUPER_ADMIN role ID
  const superAdminRole = await prisma.role.findFirst({
    where: { name: RoleEnum.SUPER_ADMIN }
  })

  if (superAdminRole) {
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@vistaraconnect.com' },
      update: {},
      create: {
        name: 'Super Admin',
        email: 'admin@vistaraconnect.com',
        emailVerified: true,
        roleId: superAdminRole.id
      }
    })
    console.log(`✅ Super Admin user seeded: ${adminUser.email}`)
  }

  console.log('Database seeding completed successfully.')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
