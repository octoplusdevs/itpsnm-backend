import { DeleteFileUseCase } from '../file/destroy-file'
import { PrismaFilesRepository } from '@/repositories/prisma/prisma-files-repository'

export function makeDestroyFileUseCase() {
  const prismaFilesRepository = new PrismaFilesRepository()
  const deleteFileUseCase = new DeleteFileUseCase(prismaFilesRepository)

  return deleteFileUseCase
}
