import { expect, describe, it, beforeEach } from 'vitest'
import { FetchStudentUseCase } from './fetch-student'
import { InMemoryStudentRepository } from '@/repositories/in-memory/in-memory-students-repository'

let studentRepository: InMemoryStudentRepository
let sut: FetchStudentUseCase

describe('Fetch Students Use Case', () => {
  beforeEach(async () => {
    studentRepository = new InMemoryStudentRepository()
    sut = new FetchStudentUseCase(studentRepository)
  })

  it('should be able to fetch a list of students', async () => {
    await studentRepository.create({
      fullName: "Wilmy Danguya",
      dateOfBirth: new Date("2000-08-01"),
      email: "daniel.yava@gmail.com",
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
      phone: "123456789",
      type: 'SCHOLARSHIP',
      alternativePhone: "987654321",
      provinceId: 1,
      countyId: 1,
      id: 1,
      created_at: new Date(),
      update_at: new Date()
    });

    const { students } = await sut.execute({
      query: 'Wilmy Danguya',
      page: 1,
    })

    expect(students.totalItems).toBe(1)
    expect(students.items).toEqual([
      expect.objectContaining({ fullName: 'Wilmy Danguya' }),
    ])
  })

  it('should be able to fetch paginated course', async () => {
    for (let i = 1; i <= 22; i++) {
      await studentRepository.create({
        fullName: `Wilmy Danguya ${i}`,
        dateOfBirth: new Date("2000-08-01"),
        email: `daniel.yava@gmail.com${i}`,
        emissionDate: new Date(),
        expirationDate: new Date(),
        father: "Marcos",
        gender: "MALE",
        height: 1.78,
        identityCardNumber: `"0044578LA012${i}`,
        maritalStatus: 'SINGLE',
        mother: "Maria",
        password: "password123",
        residence: "Rua Principal, 123",
        phone: "123456789" + i,
        type: 'SCHOLARSHIP',
        alternativePhone: "987654321" + i,
        provinceId: 1,
        countyId: 1,
        id: 1,
        created_at: new Date(),
        update_at: new Date()
      });
    }

    const { students } = await sut.execute({
      query: 'Wilmy Danguya',
      page: 2,
    })

    expect(students.totalItems).toBe(22)
    expect(students.items).toEqual([
      expect.objectContaining({ fullName: 'Wilmy Danguya 21' }),
      expect.objectContaining({ fullName: 'Wilmy Danguya 22' }),
    ])
  })
})
