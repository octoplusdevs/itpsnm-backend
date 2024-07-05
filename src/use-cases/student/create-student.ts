import { StudentsRepository } from '@/repositories/student-repository'
import { Student } from '@prisma/client'
import { StudentCreateInput } from '@/repositories/student-repository'
import { EmailAlreadyExistsError } from '../errors/email-already-exists-error'
import { PhoneAlreadyExistsError } from '../errors/phone-already-exists-error'
import { AlternativePhoneAlreadyExistsError } from '../errors/alternative-phone-already-exists-error'
import { IdentityCardNumberAlreadyExistsError } from '../errors/id-card-already-exists-error'

interface CreateStudentUseCaseResponse {
  student: Student
}

export class CreateStudentUseCase {
  constructor(private studentRepository: StudentsRepository) { }

  async execute({
    id,
    classeId,
    countyId,
    courseId,
    dateOfBirth,
    email,
    emissionDate,
    expirationDate,
    father,
    fullName,
    gender,
    height,
    identityCardNumber,
    levelId,
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

    const student = await this.studentRepository.create({
      id,
      classeId,
      countyId,
      courseId,
      dateOfBirth,
      email,
      emissionDate,
      expirationDate,
      father,
      fullName,
      gender,
      height,
      identityCardNumber,
      levelId,
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
