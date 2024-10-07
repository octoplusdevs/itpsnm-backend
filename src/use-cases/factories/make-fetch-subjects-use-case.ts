import { FetchSubjectUseCase } from '../subjects/fetch-subject'
import { PrismaSubjectRepository } from '@/repositories/prisma/prisma-subject-repository'

export function makeFetchSubjectUseCase() {
  const prismaSubjectRepository = new PrismaSubjectRepository()
  const fetchSubjectUseCase = new FetchSubjectUseCase(prismaSubjectRepository)

  return fetchSubjectUseCase
}
