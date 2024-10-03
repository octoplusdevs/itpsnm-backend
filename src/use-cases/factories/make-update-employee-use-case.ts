import { PrismaEmployeeRepository } from '@/repositories/prisma/prisma-employee-repository'
import { UpdateEmployeeUseCase } from '../employees/update-employee'

export function makeUpdateEmployeeUseCase() {
  const prismaEmployeeRepository = new PrismaEmployeeRepository()
  const updateUseCase = new UpdateEmployeeUseCase(prismaEmployeeRepository)

  return updateUseCase
}
