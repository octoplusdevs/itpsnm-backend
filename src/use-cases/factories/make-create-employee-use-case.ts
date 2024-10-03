import { CreateEmployeeUseCase } from '../employees/create-employee'
import { PrismaEmployeeRepository } from '@/repositories/prisma/prisma-employee-repository'
import { EmployeeRepository } from '@/repositories/employee-repository'

export function makeCreateEmployeeUseCase(): CreateEmployeeUseCase {
  const prismaEmployeeRepository: EmployeeRepository = new PrismaEmployeeRepository()

  return new CreateEmployeeUseCase(prismaEmployeeRepository)
}
