import { env } from '@/env'
import { Course, Level, PrismaClient, Province } from '@prisma/client'

export const prisma = new PrismaClient({
  // log: env.NODE_ENV === 'dev' ? ['query', 'info', 'warn', 'error'] : [],
  log: []
})

async function main() {
  const Provinces = [
    { name: "Luanda", id: 1, created_at: new Date(), update_at: new Date() },
    { name: "Benguela", id: 2, created_at: new Date(), update_at: new Date() },
    { name: "Huíla", id: 3, created_at: new Date(), update_at: new Date() },
    { name: "Namibe", id: 4, created_at: new Date(), update_at: new Date() },
    { name: "Kwanza Sul", id: 5, created_at: new Date(), update_at: new Date() },
    { name: "Kwanza Norte", id: 6, created_at: new Date(), update_at: new Date() },
    { name: "Malanje", id: 7, created_at: new Date(), update_at: new Date() },
    { name: "Lunda Sul", id: 8, created_at: new Date(), update_at: new Date() },
    { name: "Lunda Norte", id: 9, created_at: new Date(), update_at: new Date() },
    { name: "Moxico", id: 10, created_at: new Date(), update_at: new Date() },
    { name: "Cuando Cubango", id: 11, created_at: new Date(), update_at: new Date() },
    { name: "Zaire", id: 12, created_at: new Date(), update_at: new Date() },
    { name: "Uíge", id: 13, created_at: new Date(), update_at: new Date() },
    { name: "Cunene", id: 14, created_at: new Date(), update_at: new Date() },
    { name: "Bengo", id: 15, created_at: new Date(), update_at: new Date() },
    { name: "Cabinda", id: 16, created_at: new Date(), update_at: new Date() },
    { name: "Luanda Norte", id: 17, created_at: new Date(), update_at: new Date() },
    { name: "Luanda Sul", id: 18, created_at: new Date(), update_at: new Date() },
  ];

  const levels: Level[] = [
    { name: "CLASS_10", id: 1, created_at: new Date(), update_at: new Date() },
    { name: "CLASS_11", id: 2, created_at: new Date(), update_at: new Date() },
    { name: "CLASS_12", id: 3, created_at: new Date(), update_at: new Date() },
    { name: "CLASS_13", id: 4, created_at: new Date(), update_at: new Date() },
  ]
  const courses: Course[] = [
    { name: "Ensino Médio Geral", id: 1, created_at: new Date(), update_at: new Date() },
    { name: "Ciências Sociais", id: 2, created_at: new Date(), update_at: new Date() },
    { name: "Ciências Exatas", id: 3, created_at: new Date(), update_at: new Date() },
    { name: "Humanidades", id: 4, created_at: new Date(), update_at: new Date() },
    { name: "Curso Técnico em Informática", id: 5, created_at: new Date(), update_at: new Date() },
    { name: "Curso Técnico em Enfermagem", id: 6, created_at: new Date(), update_at: new Date() },
    { name: "Curso Técnico em Gestão", id: 7, created_at: new Date(), update_at: new Date() },
    { name: "Curso de Formação Profissional", id: 8, created_at: new Date(), update_at: new Date() },
    { name: "Curso de Artes", id: 9, created_at: new Date(), update_at: new Date() },
    { name: "Curso de Línguas Estrangeiras", id: 10, created_at: new Date(), update_at: new Date() },
  ];


  await prisma.province.createMany({
    data: Provinces,
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
