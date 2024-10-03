import { PhoneAlreadyExistsError } from '../errors/phone-already-exists-error'
import { IdentityCardNumberAlreadyExistsError } from '../errors/id-card-already-exists-error'
import { EmployeeRepository } from '@/repositories/employee-repository'
import { Employee, Prisma } from '@prisma/client'

interface CreateEmployeeUseCaseResponse {
  employee: Employee
}

export class CreateEmployeeUseCase {
  constructor(
    private employeeRepository: EmployeeRepository,
  ) { }

  async execute({
    fullName,
    dateOfBirth,
    emissionDate,
    expirationDate,
    gender,
    identityCardNumber,
    maritalStatus,
    phone,
    residence,
    alternativePhone,
  }: Prisma.EmployeeCreateInput): Promise<CreateEmployeeUseCaseResponse> {

    const userWithSamePhone = await this.employeeRepository.findByPhone(phone)
    if (userWithSamePhone) {
      throw new PhoneAlreadyExistsError()
    }

    const userWithSameBI = await this.employeeRepository.findByIdentityCardNumber(identityCardNumber)
    if (userWithSameBI) {
      throw new IdentityCardNumberAlreadyExistsError()
    }

    const employee:Employee = await this.employeeRepository.create({
      dateOfBirth,
      emissionDate,
      expirationDate,
      fullName,
      gender,
      identityCardNumber,
      maritalStatus,
      phone,
      residence,
      alternativePhone: alternativePhone!,
    })

    return {
      employee,
    }
  }
}
