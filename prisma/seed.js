require("dotenv/config");

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");

const adapter = new PrismaPg(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "owner@teste.com";
  const passwordHash = await bcrypt.hash("SenhaTeste123", 12);

  await prisma.office.upsert({
    where: { slug: "escritorio-teste" },
    update: {},
    create: {
      name: "Escritorio Teste",
      slug: "escritorio-teste",
      subscription: {
        create: {
          plan: "FREE",
          status: "TRIALING",
        },
      },
      users: {
        create: {
          name: "Usuario Owner",
          email,
          passwordHash,
          role: "OWNER",
        },
      },
    },
  });

  console.log("Seed concluido: owner@teste.com / SenhaTeste123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
