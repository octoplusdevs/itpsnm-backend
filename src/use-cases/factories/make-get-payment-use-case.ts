import { GetPaymentUseCase } from '../payment/get-payment'
import { PrismaPaymentRepository } from '@/repositories/prisma/prisma-payments-repository'

export function makeGetPaymentUseCase() {
  const prismaPaymentRepository = new PrismaPaymentRepository()
  const getUserUseCase = new GetPaymentUseCase(prismaPaymentRepository)

  return getUserUseCase
}
