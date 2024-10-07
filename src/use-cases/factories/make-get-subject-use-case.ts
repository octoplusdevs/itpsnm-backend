import { PrismaSubjectRepository } from '@/repositories/prisma/prisma-subject-repository'
import { GetSubjectUseCase } from '../subjects/get-subject'

export function makeGetSubjectUseCase() {
  const prismaSubjectRepository = new PrismaSubjectRepository()
  const useCase = new GetSubjectUseCase(prismaSubjectRepository)

  return useCase
}
