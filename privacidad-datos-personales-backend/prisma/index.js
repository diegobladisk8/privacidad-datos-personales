import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const personas = await prisma.persona.findMany();
    console.log(personas);
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
