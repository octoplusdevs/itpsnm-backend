import { CreatePaymentUseCase } from '../payment/register-payment'
import { PrismaPaymentRepository } from '@/repositories/prisma/prisma-payments-repository'
import { PrismaStudentsRepository } from '@/repositories/prisma/prisma-student-repository'

export function makePaymentUseCase() {
  const prismaPaymentRepository = new PrismaPaymentRepository()
  const prismaStudentRepository = new PrismaStudentsRepository()
  const createDocumentWithFilesUseCase = new CreatePaymentUseCase(prismaPaymentRepository, prismaStudentRepository)

  return createDocumentWithFilesUseCase
}
