import { prisma } from '@/lib/prisma'
import { Course } from '@prisma/client'

import { CoursesRepository } from '../course-repository'

export class PrismaCoursesRepository implements CoursesRepository {
  async findByName(name: string): Promise<Course | null> {
    const findCourse = await prisma.course.findUnique({
      where: {
        name
      }
    })
    return findCourse
  }
  async create(data: { id?: number | undefined; name: string }): Promise<Course> {
    let newCourse = await prisma.course.create({
      data: {
        name: data.name,
      }
    })
    return newCourse
  }
  async searchMany(query: string, page: number): Promise<Course[]> {
    let pageSize = 20
    let courses = await prisma.course.findMany({
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
    let findCourse = await prisma.course.delete({
      where: {
        id
      }
    })
    return findCourse ? true : false
  }
  async findById(id: number) {
    const course = await prisma.course.findUnique({
      where: {
        id,
      },
    })

    return course
  }
}
