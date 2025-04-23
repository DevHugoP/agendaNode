import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  for (const user of users) {
    const existing = await prisma.profile.findUnique({ where: { userId: user.id } });
    if (!existing) {
      await prisma.profile.create({
        data: {
          userId: user.id,
          fullName: user.name, // ou "" si tu veux laisser vide
          profession: null,
          company: null,
          address: null,
          website: null,
          bio: null,
          avatar: null,
        },
      });
      console.log(`Profil créé pour user #${user.id}`);
    }
  }
}

main()
  .then(() => {
    console.log('Tous les profils manquants ont été créés');
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
