import { PrismaFilesRepository } from '@/repositories/prisma/prisma-files-repository'
import { GetFilesByStudentIdUseCase } from '../file/get-file-by-student-id'

export function makeGetFileByStudentIdUseCase() {
  const prismaFilesRepository = new PrismaFilesRepository()
  const getFileUseCase = new GetFilesByStudentIdUseCase(prismaFilesRepository)

  return getFileUseCase
}
