import { StudentsRepository } from '@/repositories/student-repository'
import { Student } from '@prisma/client'
import { StudentCreateInput } from '@/repositories/student-repository'
import { EmailAlreadyExistsError } from '../errors/email-already-exists-error'
import { PhoneAlreadyExistsError } from '../errors/phone-already-exists-error'
import { AlternativePhoneAlreadyExistsError } from '../errors/alternative-phone-already-exists-error'
import { IdentityCardNumberAlreadyExistsError } from '../errors/id-card-already-exists-error'
import { prisma } from '@/lib/prisma'
import { ProvinceNotFoundError } from '../errors/province-not-found'
import { ProvincesRepository } from '@/repositories/province-repository'

interface CreateStudentUseCaseResponse {
  student: Student
}

export class CreateStudentUseCase {
  constructor(
    private studentRepository: StudentsRepository,
    private provinceRepository: ProvincesRepository
  ) { }

  async execute({
    id,
    countyId,
    dateOfBirth,
    email,
    emissionDate,
    expirationDate,
    father,
    fullName,
    gender,
    height,
    identityCardNumber,
    maritalStatus,
    mother,
    password,
    phone,
    provinceId,
    residence,
    type,
    alternativePhone
  }: StudentCreateInput): Promise<CreateStudentUseCaseResponse> {

    const userWithSameEmail = await this.studentRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new EmailAlreadyExistsError()
    }

    const userWithSamePhone = await this.studentRepository.findByPhone(phone)
    if (userWithSamePhone) {
      throw new PhoneAlreadyExistsError()
    }

    if (alternativePhone != null && alternativePhone != undefined) {
      const userWithSameAlternativePhone = await this.studentRepository.findByAlternativePhone(alternativePhone)
      if (userWithSameAlternativePhone) {
        throw new AlternativePhoneAlreadyExistsError()
      }
    }

    const userWithSameBI = await this.studentRepository.findByIdentityCardNumber(identityCardNumber)
    if (userWithSameBI) {
      throw new IdentityCardNumberAlreadyExistsError()
    }

    const findProvince = await this.provinceRepository.findById(provinceId)
    if (!findProvince) {
      throw new ProvinceNotFoundError()
    }

    const findCounty = await this.provinceRepository.findById(countyId)
    if (!findCounty) {
      throw new ProvinceNotFoundError()
    }

    const student = await this.studentRepository.create({
      id,
      countyId,
      dateOfBirth,
      email,
      emissionDate,
      expirationDate,
      father,
      fullName,
      gender,
      height,
      identityCardNumber,
      maritalStatus,
      mother,
      password,
      phone,
      provinceId,
      residence,
      type,
      alternativePhone
    })

    return {
      student,
    }
  }
}
