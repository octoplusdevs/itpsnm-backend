import { Employee, Prisma } from '@prisma/client'

export interface EmployeeRepository {
  findById(id: number): Promise<Employee | null>
  findByIdentityCardNumber(identityCardNumber: string): Promise<Employee | null>
  findByAlternativePhone(phone: string): Promise<Employee | null>
  findByPhone(phone: string): Promise<Employee | null>
  findByName(name: string): Promise<Employee | null>
  create(data: Prisma.EmployeeCreateInput): Promise<Employee>
  searchMany(page: number): Promise<{
    totalItems: number;
    currentPage: number;
    totalPages: number;
    items: Employee[];
  }>
  destroy(id: number): Promise<boolean>;
  update(id: number, data: Prisma.EmployeeUpdateInput): Promise<Employee>
}
