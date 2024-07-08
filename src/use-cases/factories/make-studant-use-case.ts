import { PrismaStudentsRepository } from '@/repositories/prisma/prisma-student-repository'
import { CreateStudentUseCase } from '../student/create-student'

export function makeStudanteUseCase() {
  const prismaStudentsRepository = new PrismaStudentsRepository()
  const createStudentUseCase = new CreateStudentUseCase(prismaStudentsRepository)

  return createStudentUseCase
}
