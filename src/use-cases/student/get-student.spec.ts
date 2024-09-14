import { expect, describe, it, beforeEach } from 'vitest'
import { GetStudentUseCase } from './get-student'
import { InMemoryStudentRepository } from '@/repositories/in-memory/in-memory-students-repository'
import { StudentNotFoundError } from '../errors/resource-not-found'
import { StudentNotFoundError } from '../errors/student-not-found'

let studentRepository: InMemoryStudentRepository
let sut: GetStudentUseCase

describe('Get Student Use Case', () => {
  beforeEach(async () => {
    studentRepository = new InMemoryStudentRepository()
    sut = new GetStudentUseCase(studentRepository)
  })

  it('should be able to get a student by ID', async () => {
    await studentRepository.create({
      id: 103,
      fullName: "Wilmy Danguya",
      dateOfBirth: new Date("2000-08-01"),
      emissionDate: new Date(),
      expirationDate: new Date(),
      father: "Marcos",
      gender: "MALE",
      height: 1.78,
      identityCardNumber: "0044578LA011",
      maritalStatus: 'SINGLE',
      mother: "Maria",
      residence: "Rua Principal, 123",
      phone: "123456789",
      type: 'SCHOLARSHIP',
      alternativePhone: "987654321",
      provinceId: 1,
      countyId: 1,
    })

    const student = await sut.execute({
      id: 103
    })

    expect(student?.id).toEqual(103)
    expect(student?.identityCardNumber).toEqual("0044578LA011")
    expect(student?.fullName).toEqual("Wilmy Danguya")
  })
  it('should not be able to get student with wrong ID', async () => {
    await expect(() =>
      sut.execute({
        id: 1,
      }),
    ).rejects.toBeInstanceOf(StudentNotFoundError)
  })
  it('should be able to get a student by identity Card Number', async () => {
    await studentRepository.create({
      fullName: "Wilmy Danguya",
      dateOfBirth: new Date("2000-08-01"),
      emissionDate: new Date(),
      expirationDate: new Date(),
      father: "Marcos",
      gender: "MALE",
      height: 1.78,
      identityCardNumber: "0044578LA011",
      maritalStatus: 'SINGLE',
      mother: "Maria",
      residence: "Rua Principal, 123",
      phone: "123456789",
      type: 'SCHOLARSHIP',
      alternativePhone: "987654321",
      provinceId: 1,
      countyId: 1,
    })

    const student = await sut.execute({
      identityCardNumber: "0044578LA011"
    })

    expect(student?.identityCardNumber).toEqual("0044578LA011")
    expect(student?.fullName).toEqual("Wilmy Danguya")
  })
  it('should not be able to get student with wrong identity Card Number', async () => {
    await expect(() =>
      sut.execute({
        identityCardNumber: "1",
      }),
    ).rejects.toBeInstanceOf(StudentNotFoundError)
  })
  it('should be able to get a student by identityCardNumber', async () => {
    await studentRepository.create({
      fullName: "Daniel Gustavo",
      dateOfBirth: new Date("2000-08-01"),
      emissionDate: new Date(),
      expirationDate: new Date(),
      father: "Marcos",
      gender: "MALE",
      height: 1.78,
      identityCardNumber: "0044578LA011",
      maritalStatus: 'SINGLE',
      mother: "Maria",
      residence: "Rua Principal, 123",
      phone: "123456789",
      type: 'SCHOLARSHIP',
      alternativePhone: "987654321",
      provinceId: 1,
      countyId: 1,
    })

    const student = await sut.execute({
      identityCardNumber: "0044578LA011"
    })

    expect(student?.identityCardNumber).toEqual("0044578LA011")
    expect(student?.fullName).toEqual("Daniel Gustavo")
  })
  it('should not be able to get student with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: "1",
      }),
    ).rejects.toBeInstanceOf(StudentNotFoundError)
  })
  it('should be able to get a student by phone', async () => {
    await studentRepository.create({
      fullName: "Daniel Gustavo",
      dateOfBirth: new Date("01/08/2000"),
      emissionDate: new Date(),
      expirationDate: new Date(),
      father: "Alguem",
      gender: "MALE",
      height: 1.23,
      identityCardNumber: "0044578LA011",
      maritalStatus: 'SINGLE',
      mother: "222",
      residence: "www",
      type: 'SCHOLARSHIP',
      provinceId: 1,
      countyId: 1,
      phone: '935555500'
    })
    const student = await sut.execute({
      phone: "935555500"
    })

    expect(student?.identityCardNumber).toEqual("0044578LA011")
    expect(student?.fullName).toEqual("Daniel Gustavo")
  })
  it('should not be able to get student with wrong phone', async () => {
    await expect(() =>
      sut.execute({
        phone: "123",
      }),
    ).rejects.toBeInstanceOf(StudentNotFoundError)
  })
  it('should be able to get a student by alternative phone', async () => {
    await studentRepository.create({
      fullName: "Daniel Gustavo",
      dateOfBirth: new Date("2000-08-01"),
      emissionDate: new Date(),
      expirationDate: new Date(),
      father: "Marcos",
      gender: "MALE",
      height: 1.78,
      identityCardNumber: "0044578LA011",
      maritalStatus: 'SINGLE',
      mother: "Maria",
      residence: "Rua Principal, 123",
      phone: "123456789",
      type: 'SCHOLARSHIP',
      alternativePhone: "935555777",
      provinceId: 1,
      countyId: 1,
    })

    const student = await sut.execute({
      alternativePhone: "935555777"
    })

    expect(student?.identityCardNumber).toEqual("0044578LA011")
    expect(student?.fullName).toEqual("Daniel Gustavo")
  })
  it('should not be able to get student with wrong alternative phone', async () => {
    await expect(() =>
      sut.execute({
        alternativePhone: "123",
      }),
    ).rejects.toBeInstanceOf(StudentNotFoundError)
  })
  it('should be able to get a student  by Name', async () => {
    await studentRepository.create({
      fullName: "Daniel Gustavo",
      dateOfBirth: new Date("2000-08-01"),
      emissionDate: new Date(),
      expirationDate: new Date(),
      father: "Marcos",
      gender: "MALE",
      height: 1.78,
      identityCardNumber: "0044578LA011",
      maritalStatus: 'SINGLE',
      mother: "Maria",
      residence: "Rua Principal, 123",
      phone: "123456789",
      type: 'SCHOLARSHIP',
      alternativePhone: "935555777",
      provinceId: 1,
      countyId: 1,
    })

    const student = await sut.execute({
      name: "Daniel Gustavo",
    })

    expect(student?.identityCardNumber).toEqual("0044578LA011")
    expect(student?.fullName).toEqual("Daniel Gustavo")
  })
  it('should not be able to get student with wrong alternative phone', async () => {
    await expect(() =>
      sut.execute({
        name: "non existing name",
      }),
    ).rejects.toBeInstanceOf(StudentNotFoundError)
  })
})
