import { PrismaFilesRepository } from '@/repositories/prisma/prisma-files-repository'
import { GetFilesByStudentsIdentityCardNumberUseCase } from '../file/get-file-by-student-id'

export function makeGetFileByStudentIdUseCase() {
  const prismaFilesRepository = new PrismaFilesRepository()
  const getFileUseCase = new GetFilesByStudentsIdentityCardNumberUseCase(prismaFilesRepository)

  return getFileUseCase
}
