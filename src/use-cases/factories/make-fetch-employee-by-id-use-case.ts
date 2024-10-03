import { PrismaEmployeeRepository } from '@/repositories/prisma/prisma-employee-repository'
import { FetchEmployeeByIdUseCase } from '../employees/fetch-by-id-employee'

export function makeFetchEmployeeByIdUseCase() {
  const prismaEmployeeRepository = new PrismaEmployeeRepository()
  const fetchEmployeeUseCase = new FetchEmployeeByIdUseCase(prismaEmployeeRepository)

  return fetchEmployeeUseCase
}
