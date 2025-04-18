import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "hugo@example.com",
      name: "Hugo Polchetti",
      phone: "+41 79 123 45 67",
    },
  });

  await prisma.appointment.create({
    data: {
      date: new Date(),
      client: "Client de test",
      userId: user.id,
    },
  });
}

main()
  .then(() => {
    console.log("✅ Seed complete");
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
