import { StudentsRepository } from '@/repositories/student-repository'
import { Student } from '@prisma/client'
import { StudentCreateInput } from '@/repositories/student-repository'
import { PhoneAlreadyExistsError } from '../errors/phone-already-exists-error'
import { IdentityCardNumberAlreadyExistsError } from '../errors/id-card-already-exists-error'
import { ProvinceNotFoundError } from '../errors/province-not-found'
import { ProvincesRepository } from '@/repositories/province-repository'
import { CountyRepository } from '@/repositories/county-repository'
import { CountyNotFoundError } from '../errors/county-not-found'

interface CreateStudentUseCaseResponse {
  student: Student
}

export class CreateStudentUseCase {
  constructor(
    private studentRepository: StudentsRepository,
    private provinceRepository: ProvincesRepository,
    private countyRepository: CountyRepository
  ) { }

  async execute({
    id,
    countyId,
    dateOfBirth,
    emissionDate,
    expirationDate,
    father,
    fullName,
    gender,
    height,
    identityCardNumber,
    maritalStatus,
    mother,
    phone,
    provinceId,
    residence,
    type,
    alternativePhone
  }: StudentCreateInput): Promise<CreateStudentUseCaseResponse> {


    const userWithSamePhone = await this.studentRepository.findByPhone(phone)
    if (userWithSamePhone) {
      throw new PhoneAlreadyExistsError()
    }

    const userWithSameBI = await this.studentRepository.findByIdentityCardNumber(identityCardNumber)
    if (userWithSameBI) {
      throw new IdentityCardNumberAlreadyExistsError()
    }

    const findProvince = await this.provinceRepository.findById(provinceId)
    if (!findProvince) {
      throw new ProvinceNotFoundError()
    }

    const findCounty = await this.countyRepository.findById(countyId)
    if (!findCounty) {
      throw new CountyNotFoundError()
    }

    const student = await this.studentRepository.create({
      id: id!,
      countyId,
      dateOfBirth,
      emissionDate,
      expirationDate,
      father,
      fullName,
      gender,
      height,
      identityCardNumber,
      maritalStatus,
      mother,
      phone,
      provinceId,
      residence,
      type,
      alternativePhone: alternativePhone!,
    })

    return {
      student,
    }
  }
}
