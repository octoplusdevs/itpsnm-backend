import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryStudentRepository } from '@/repositories/in-memory/in-memory-students-repository'
import { DestroyStudentUseCase } from './destroy-student'

let studentsRepository: InMemoryStudentRepository
let sut: DestroyStudentUseCase

describe('Destroy Student Use Case', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentRepository()
    sut = new DestroyStudentUseCase(studentsRepository)
  })
  it('should be able to destroy a student', async () => {
    const student = await studentsRepository.create({
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

    const response = await sut.execute({ studentId: student.id })

    expect(response).toBe(true)
  })
})
