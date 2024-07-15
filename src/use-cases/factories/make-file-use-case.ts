import { CreateFileUseCase } from '../file/create-file'
import { PrismaFilesRepository } from '@/repositories/prisma/prisma-files-repository'

export function makeCreateFileUseCase() {
  const prismaFilesRepository = new PrismaFilesRepository()
  const createFileUseCase = new CreateFileUseCase(prismaFilesRepository)

  return createFileUseCase
}
