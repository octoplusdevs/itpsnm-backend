import { PhoneAlreadyExistsError } from '../errors/phone-already-exists-error'
import { IdentityCardNumberAlreadyExistsError } from '../errors/id-card-already-exists-error'
import { EmployeeRepository } from '@/repositories/employee-repository'
import { Employee, Gender, MaritalStatus } from '@prisma/client'
import { EmployeeNotFoundError } from '../errors/employee-not-found'

interface UpdateEmployeeUseCaseRequest {
  id: number // Corrigido para 'number'
  fullName?: string
  dateOfBirth?: Date
  emissionDate?: Date
  expirationDate?: Date
  gender?: Gender // Usando o enum de 'gender'
  identityCardNumber?: string
  maritalStatus?: MaritalStatus // Usando o enum de 'maritalStatus'
  phone?: string
  residence?: string
  alternativePhone?: string
}

interface UpdateEmployeeUseCaseResponse {
  employee: Employee
}

export class UpdateEmployeeUseCase {
  constructor(
    private employeeRepository: EmployeeRepository,
  ) { }

  async execute({
    id,
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
  }: UpdateEmployeeUseCaseRequest): Promise<UpdateEmployeeUseCaseResponse> {

    // Busca o funcionário atual
    const existingEmployee = await this.employeeRepository.findById(id)
    if (!existingEmployee) {
      throw new EmployeeNotFoundError()
    }

    // Verifica se o telefone já está em uso por outro funcionário
    if (phone) {
      const userWithSamePhone = await this.employeeRepository.findByPhone(phone)
      if (userWithSamePhone && userWithSamePhone.id !== id) {
        throw new PhoneAlreadyExistsError()
      }
    }

    // Verifica se o número do BI já está em uso por outro funcionário
    if (identityCardNumber) {
      const userWithSameBI = await this.employeeRepository.findByIdentityCardNumber(identityCardNumber)
      if (userWithSameBI && userWithSameBI.id !== id) {
        throw new IdentityCardNumberAlreadyExistsError()
      }
    }

    // Atualiza o funcionário com base nos valores fornecidos
    const updatedEmployee = await this.employeeRepository.update(id, {
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
    })

    return {
      employee: updatedEmployee,
    }
  }
}
