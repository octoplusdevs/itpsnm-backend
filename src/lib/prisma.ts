import { PrismaClient } from '@prisma/client'
import { Provinces, courses, itemPrices, levels } from './bulk_insert';

export const prisma = new PrismaClient({
  // log: env.NODE_ENV === 'dev' ? ['query', 'info', 'warn', 'error'] : [],
  log: []
})

async function main() {


  await prisma.province.deleteMany()
  await prisma.itemPrices.deleteMany()
  await prisma.level.deleteMany()
  await prisma.course.createMany({
    data: Provinces,
  });

  await prisma.itemPrices.createMany({
    data: itemPrices,
  });
  await prisma.level.createMany({
    data: levels,
  });
  await prisma.course.createMany({
    data: courses,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
