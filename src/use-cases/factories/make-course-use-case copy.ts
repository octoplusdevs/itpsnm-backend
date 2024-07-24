import { CreateDocumentWithFilesUseCase } from '../document/create-document-with-files'
import { PrismaDocumentRepository } from '@/repositories/prisma/prisma-documents-repository'
import { PrismaEnrollmentsRepository } from '@/repositories/prisma/prisma-enrollments-repository'
import { PrismaFilesRepository } from '@/repositories/prisma/prisma-files-repository'

export function makeCreateDocumentWithFilesUseCase() {
  const prismaDocumentRepository = new PrismaDocumentRepository()
  const prismaFilesRepository = new PrismaFilesRepository()
  const prismaEnrollmentsRepository = new PrismaEnrollmentsRepository()
  const createDocumentWithFilesUseCase = new CreateDocumentWithFilesUseCase(prismaDocumentRepository, prismaFilesRepository, prismaEnrollmentsRepository)

  return createDocumentWithFilesUseCase
}
