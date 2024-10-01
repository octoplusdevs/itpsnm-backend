import { EmployeeRepository } from '@/repositories/employee-repository'
import { Employee } from '@prisma/client'

interface FetchEmployeesUseCaseRequest {
  page: number
}

interface FetchEmployeesUseCaseResponse {
  employees: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    items: Employee[];
  }
}

export class FetchEmployeeUseCase {
  constructor(private employeeRepository: EmployeeRepository) { }

  async execute({
    page
  }: FetchEmployeesUseCaseRequest): Promise<FetchEmployeesUseCaseResponse> {
    const employees = await this.employeeRepository.searchMany(
      page
    )

    return {
      employees,
    }
  }
}
