import { prisma } from '@/lib/prisma'
import { Classe } from '@prisma/client'
import { ClasseRepository } from '../classe-repository';


export class PrismaClasseRepository implements ClasseRepository {
  create(data: { id?: number | undefined; name: string; }): Promise<{ id: number; name: string; course: string; id_classroom: number; period: string; created_at: Date; update_at: Date; }> {
    throw new Error('Method not implemented.');
  }
  async findByName(name: string): Promise<Classe | null> {
    const findClasse = await prisma.classe.findFirst({
      where: {
        name
      }
    })
    return findClasse
  }

  async searchMany(query: string, page: number): Promise<Classe[]> {
    let pageSize = 20
    let courses = await prisma.classe.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive'
        }
      },
      skip: (page - 1) * pageSize,
      take: pageSize
    })
    return courses
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
