import { EmployeeRepository } from '@/repositories/employee-repository';
import { Employee } from '@prisma/client';

interface FetchEmployeeByIdUseCaseResponse {
  employee: Employee | null;
}

export class FetchEmployeeByIdUseCase {
  constructor(private employeeRepository: EmployeeRepository) {}

  async execute(id: number): Promise<FetchEmployeeByIdUseCaseResponse> {
    const employee = await this.employeeRepository.findById(Number(id));

    return {
      employee,
    };
  }
}
