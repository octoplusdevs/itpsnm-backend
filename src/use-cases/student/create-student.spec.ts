import { expect, describe, it, beforeEach } from 'vitest'
import { CreateStudentUseCase } from './create-student'
import { InMemoryStudentRepository } from '@/repositories/in-memory/in-memory-students-repository'
import { EmailAlreadyExistsError } from '../errors/email-already-exists-error'
import { IdentityCardNumberAlreadyExistsError } from '../errors/id-card-already-exists-error'
import { AlternativePhoneAlreadyExistsError } from '../errors/alternative-phone-already-exists-error'

let studentsRepository: InMemoryStudentRepository
let sut: CreateStudentUseCase

describe('Create Student Use Case', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentRepository()
    sut = new CreateStudentUseCase(studentsRepository)
  })
  it('should be able to create student', async () => {
    const { student } = await sut.execute({
      fullName: "Wilmy Danguya",
      dateOfBirth: new Date("01/08/2000"),
      email: "daniel.yava16@gmail.com",
      emissionDate: new Date(),
      expirationDate: new Date(),
      father: "Alguem",
      gender: "MALE",
      height: 1.23,
      identityCardNumber: "2222",
      maritalStatus: 'SINGLE',
      mother: "222",
      password: "2222",
      residence: "www",
      phone: 222222,
      type: 'SCHOLARSHIP',
      alternativePhone: 22222,
      provinceId: 1,
      classeId: 1,
      countyId: 1,
      courseId: 1,
      levelId: 1,

    })

    expect(student.id).toEqual(expect.any(Number))
  })

  it('should not be able to register with same email twice', async () => {
    const email = "daniel.yava16@gmail.com";
    await sut.execute({
      fullName: "Wilmy Danguya",
      dateOfBirth: new Date("2000-08-01"),
      email,
      emissionDate: new Date(),
      expirationDate: new Date(),
      father: "Marcos",
      gender: "MALE",
      height: 1.78,
      identityCardNumber: "0044578LA012",
      maritalStatus: 'SINGLE',
      mother: "Maria",
      password: "password123",
      residence: "Rua Principal, 123",
      phone: 123456789,
      type: 'SCHOLARSHIP',
      alternativePhone: 987654321,
      provinceId: 1,
      classeId: 1,
      countyId: 1,
      courseId: 1,
      levelId: 1,
    });

    await expect(sut.execute({
      fullName: "Wilmy Danguya",
      dateOfBirth: new Date("2000-08-01"),
      email,
      emissionDate: new Date(),
      expirationDate: new Date(),
      father: "Marcos",
      gender: "MALE",
      height: 1.78,
      identityCardNumber: "0044578LA012",
      maritalStatus: 'SINGLE',
      mother: "Maria",
      password: "password123",
      residence: "Rua Principal, 123",
      phone: 123456781,
      type: 'SCHOLARSHIP',
      alternativePhone: 987654322,
      provinceId: 1,
      classeId: 1,
      countyId: 1,
      courseId: 1,
      levelId: 1,

    })).rejects.toBeInstanceOf(EmailAlreadyExistsError)
  })
  it('should not be able to register with same BI twice', async () => {
    const identityCardNumber = "0044578LA012"
    await sut.execute({
      fullName: "Wilmy Danguya",
      dateOfBirth: new Date("2000-08-01"),
      email: "daniel.yava16@gmail.com",
      emissionDate: new Date(),
      expirationDate: new Date(),
      father: "Marcos",
      gender: "MALE",
      height: 1.78,
      identityCardNumber,
      maritalStatus: 'SINGLE',
      mother: "Maria",
      password: "password123",
      residence: "Rua Principal, 123",
      phone: 123456789,
      type: 'SCHOLARSHIP',
      alternativePhone: 987654321,
      provinceId: 1,
      classeId: 1,
      countyId: 1,
      courseId: 1,
      levelId: 1,
    });

    await expect(sut.execute({
      fullName: "Wilmy Danguya",
      dateOfBirth: new Date("2000-08-01"),
      email: "daniel.yava17@gmail.com",
      emissionDate: new Date(),
      expirationDate: new Date(),
      father: "Marcos",
      gender: "MALE",
      height: 1.78,
      identityCardNumber,
      maritalStatus: 'SINGLE',
      mother: "Maria",
      password: "password123",
      residence: "Rua Principal, 123",
      phone: 123456781,
      type: 'SCHOLARSHIP',
      alternativePhone: 987654322,
      provinceId: 1,
      classeId: 1,
      countyId: 1,
      courseId: 1,
      levelId: 1,

    })).rejects.toBeInstanceOf(IdentityCardNumberAlreadyExistsError)
  })
  it('should not be able to register with same Alternative Phone twice', async () => {
    const alternativePhone = 987654321
    await sut.execute({
      fullName: "Wilmy Danguya",
      dateOfBirth: new Date("2000-08-01"),
      email: "daniel.yava16@gmail.com",
      emissionDate: new Date(),
      expirationDate: new Date(),
      father: "Marcos",
      gender: "MALE",
      height: 1.78,
      identityCardNumber: "0044578LA012",
      maritalStatus: 'SINGLE',
      mother: "Maria",
      password: "password123",
      residence: "Rua Principal, 123",
      phone: 123456789,
      type: 'SCHOLARSHIP',
      alternativePhone,
      provinceId: 1,
      classeId: 1,
      countyId: 1,
      courseId: 1,
      levelId: 1,
    });

    await expect(sut.execute({
      fullName: "Wilmy Danguya",
      dateOfBirth: new Date("2000-08-01"),
      email: "daniel.yava17@gmail.com",
      emissionDate: new Date(),
      expirationDate: new Date(),
      father: "Marcos",
      gender: "MALE",
      height: 1.78,
      identityCardNumber: "0044578LA012",
      maritalStatus: 'SINGLE',
      mother: "Maria",
      password: "password123",
      residence: "Rua Principal, 123",
      phone: 123456781,
      type: 'SCHOLARSHIP',
      alternativePhone,
      provinceId: 1,
      classeId: 1,
      countyId: 1,
      courseId: 1,
      levelId: 1,

    })).rejects.toBeInstanceOf(AlternativePhoneAlreadyExistsError)
  })
})