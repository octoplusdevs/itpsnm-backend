import { PrismaFilesRepository } from '@/repositories/prisma/prisma-files-repository'
import { GetFileByIdUseCase } from '../file/get-file-by-id'

export function makeGetFileByIdUseCase() {
  const prismaFilesRepository = new PrismaFilesRepository()
  const getFileUseCase = new GetFileByIdUseCase(prismaFilesRepository)

  return getFileUseCase
}
