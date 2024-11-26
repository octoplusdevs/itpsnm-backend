import { prisma } from '@/lib/prisma'
import { Classe, ClasseType, Prisma } from '@prisma/client'
import { ClasseRepository } from '../classe-repository';


export class PrismaClasseRepository implements ClasseRepository {
  async create(data: Prisma.ClasseCreateInput): Promise<Classe | null> {
    const newClasse = await prisma.classe.create({
      data,
    });

    return newClasse
  }
  async findByName(name: ClasseType): Promise<Classe | null> {
    const findClasse = await prisma.classe.findFirst({
      where: {
        name
      }
    })
    return findClasse
  }

  async searchMany(name: ClasseType, page: number): Promise<Classe[]> {
    let pageSize = 20
    let classes = await prisma.classe.findMany({
      where: {
        name
      },
      skip: (page - 1) * pageSize,
      take: pageSize
    })
    return classes
  }
  async destroy(id: number): Promise<boolean> {
    let findClasse = await prisma.classe.delete({
      where: {
        id
      }
    })
    return findClasse ? true : false
  }
  async findById(id: number) {
    const classe = await prisma.classe.findUnique({
      where: {
        id,
      },
    })

    return classe
  }
}
