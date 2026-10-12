import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      is_public: true,
      status: true,
      github_owner: true,
      github_repo: true,
      images: {
        select: {
          image_url: true,
          caption: true,
        }
      }
    },
    orderBy: { created_at: "desc" },
    take: 10
  });
  console.log(JSON.stringify(projects, null, 2));
}

main().finally(() => prisma.$disconnect());
