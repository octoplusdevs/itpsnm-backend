import { FetchEmployeeUseCase } from '../employees/fetch-employee'
import { PrismaEmployeeRepository } from '@/repositories/prisma/prisma-employee-repository'

export function makeFetchEmployeesUseCase() {
  const prismaEmployeeRepository = new PrismaEmployeeRepository()
  const fetchEmployeeUseCase = new FetchEmployeeUseCase(prismaEmployeeRepository)

  return fetchEmployeeUseCase
}
