import { PrismaStudentsRepository } from '@/repositories/prisma/prisma-student-repository'
import { CreateStudentUseCase } from '../student/create-student'
import { PrismaProvincesRepository } from '@/repositories/prisma/prisma-province-repository'
import { PrismaCountyRepository } from '@/repositories/prisma/prisma-county-repository'

export function makeStudentUseCase() {
  const prismaStudentsRepository = new PrismaStudentsRepository()
  const prismaProvinceRepository = new PrismaProvincesRepository()
  const prismaCountyRepository = new PrismaCountyRepository()
  const createStudentUseCase = new CreateStudentUseCase(prismaStudentsRepository, prismaProvinceRepository, prismaCountyRepository)

  return createStudentUseCase
}
