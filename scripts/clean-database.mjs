import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function cleanDatabase() {
  console.log("Cleaning database completely of all dummy and seeded data...");
  await prisma.generationJob.deleteMany({});
  await prisma.projectImage.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.user.deleteMany({});
  console.log("✓ Database successfully wiped clean. Starting completely fresh!");
}

cleanDatabase()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
