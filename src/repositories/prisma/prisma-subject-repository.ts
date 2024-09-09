import { prisma } from '@/lib/prisma'
import { Subject } from '@prisma/client'

import { SubjectsRepository } from '../subject-repository'

export class PrismaSubjectRepository implements SubjectsRepository {
  async findByName(name: string): Promise<Subject | null> {
    const findSubject = await prisma.subject.findUnique({
      where: {
        name
      }
    })
    return findSubject
  }
  async create(data: { id?: number | undefined; name: string }): Promise<Subject> {
    let newSubject = await prisma.subject.create({
      data: {
        name: data.name,
      }
    })
    return newSubject
  }
  async searchMany(query: string, page: number): Promise<Subject[]> {
    let pageSize = 20
    let courses = await prisma.subject.findMany({
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
    let findSubject = await prisma.subject.delete({
      where: {
        id
      }
    })
    return findSubject ? true : false
  }
  async findById(id: number) {
    const subject = await prisma.subject.findUnique({
      where: {
        id,
      },
    })

    return subject
  }
}
