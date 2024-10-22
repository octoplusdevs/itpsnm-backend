import { PrismaPaymentRepository } from "@/repositories/prisma/prisma-payments-repository"
import { ApprovePaymentUseCase } from "../payment/approve-payment"
import { PrismaEmployeeRepository } from "@/repositories/prisma/prisma-employee-repository"

export function makeApprovePaymentUseCase() {
  const paymentsRepository = new PrismaPaymentRepository()
  const employeeRepository = new PrismaEmployeeRepository()
  const useCase = new ApprovePaymentUseCase(paymentsRepository, employeeRepository)

  return useCase
}
