import { PrismaStudentsRepository } from '@/repositories/prisma/prisma-student-repository'
import { CreateStudentUseCase } from '../student/create-student'
import { PrismaProvincesRepository } from '@/repositories/prisma/prisma-province-repository'

export function makeStudentUseCase() {
  const prismaStudentsRepository = new PrismaStudentsRepository()
  const prismaProvinceRepository = new PrismaProvincesRepository()
  const createStudentUseCase = new CreateStudentUseCase(prismaStudentsRepository, prismaProvinceRepository)

  return createStudentUseCase
}
