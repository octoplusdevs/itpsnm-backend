import { expect, describe, it, beforeEach } from 'vitest'
import { CreateEnrollmentUseCase } from './create-enrollment'
import { InMemoryEnrollmentRepository } from '@/repositories/in-memory/in-memory-enrollments-repository'
import { InMemoryStudentRepository } from '@/repositories/in-memory/in-memory-students-repository'
import { StudentNotFoundError } from '../errors/student-not-found'

let studentsRepository: InMemoryStudentRepository
let enrollmentsRepository: InMemoryEnrollmentRepository
let sut: CreateEnrollmentUseCase

describe('Create Enrollment Use Case', () => {
  beforeEach(() => {
    enrollmentsRepository = new InMemoryEnrollmentRepository()
    studentsRepository = new InMemoryStudentRepository()
    sut = new CreateEnrollmentUseCase(studentsRepository, enrollmentsRepository)
  })
  it('should be able to create a enrollment', async () => {
    await studentsRepository.create({
      id: 100,
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
      countyId: 1,
    })

    const { enrollment } = await sut.execute({
      state: 'PENDING',
      studentId: 100,
      created_at: new Date(),
      update_at: new Date(),
      id: 1
    });

    expect(enrollment.studentId).toBe(100);
    expect(enrollment.state).toBe('PENDING');

  })

  it('should throw an error if student does not exist', async () => {
    await expect(sut.execute({
      id: 1,
      state: 'PENDING',
      studentId: 999,
      created_at: new Date(),
      update_at: new Date(),
    })).rejects.toThrow(StudentNotFoundError);
  });

})
