import { expect, describe, it, beforeEach } from 'vitest'
import { CreateEnrollmentUseCase } from './create-enrollment'
import { InMemoryEnrollmentRepository } from '@/repositories/in-memory/in-memory-enrollments-repository'
import { InMemoryStudentRepository } from '@/repositories/in-memory/in-memory-students-repository'
import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'
import { InMemoryLevelsRepository } from '@/repositories/in-memory/in-memory-level-repository'
import { StudentNotFoundError } from '../errors/student-not-found'
import { CourseNotFoundError } from '../errors/course-not-found'
import { LevelNotFoundError } from '../errors/level-not-found'
import { EnrollementState } from '@prisma/client'
import { EnrollmentAlreadyExistsError } from '../errors/enrollment-already-exists'

let studentsRepository: InMemoryStudentRepository
let levelsRepository: InMemoryLevelsRepository
let coursesRepository: InMemoryCoursesRepository
let enrollmentsRepository: InMemoryEnrollmentRepository
let sut: CreateEnrollmentUseCase

describe('Create Enrollment Use Case', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentRepository()
    levelsRepository = new InMemoryLevelsRepository()
    coursesRepository = new InMemoryCoursesRepository()
    enrollmentsRepository = new InMemoryEnrollmentRepository()
    sut = new CreateEnrollmentUseCase(studentsRepository, levelsRepository, coursesRepository, enrollmentsRepository)
  })

  it('should be able to create an enrollment', async () => {
    const student = await studentsRepository.create({
      id: 1,
      fullName: 'John Doe',
      dateOfBirth: new Date('2000-01-01'),
      email: 'john.doe@example.com',
      emissionDate: new Date(),
      expirationDate: new Date(),
      father: 'John Doe Sr.',
      gender: 'MALE',
      height: 1.75,
      identityCardNumber: '1234567890',
      maritalStatus: 'SINGLE',
      mother: 'Jane Doe',
      password: 'password123',
      residence: '123 Main St, City',
      phone: "1234567890",
      type: 'REGULAR',
      alternativePhone: "9876543210",
      provinceId: 1,
      countyId: 1,
    })

    const course = await coursesRepository.create({
      id: 1,
      name: 'Computer Science',
    })

    const level = await levelsRepository.create({
      id: 1,
      name: 'CLASS_10',
    })

    const { enrollment } = await sut.execute({
      id: 1,
      state: EnrollementState.PENDING,
      identityCardNumber: '1234567890',
      courseId: course.id,
      levelId: level.id,
    })

    expect(enrollment.studentId).toBe(student.id)
    expect(enrollment.state).toBe(EnrollementState.PENDING)
  })

  it('should throw StudentNotFoundError if student is not found', async () => {
    await expect(() =>
      sut.execute({
        id: 1,
        state: EnrollementState.PENDING,
        identityCardNumber: '1234567890',
        courseId: 1,
        levelId: 1,
      })
    ).rejects.toBeInstanceOf(StudentNotFoundError)
  })

  it('should throw CourseNotFoundError if course is not found', async () => {
    const student = await studentsRepository.create({
      id: 1,
      fullName: 'John Doe',
      dateOfBirth: new Date('2000-01-01'),
      email: 'john.doe@example.com',
      emissionDate: new Date(),
      expirationDate: new Date(),
      father: 'John Doe Sr.',
      gender: 'MALE',
      height: 1.75,
      identityCardNumber: '1234567890',
      maritalStatus: 'SINGLE',
      mother: 'Jane Doe',
      password: 'password123',
      residence: '123 Main St, City',
      phone: "1234567890",
      type: 'REGULAR',
      alternativePhone: "9876543210",
      provinceId: 1,
      countyId: 1,
    })

    await expect(() =>
      sut.execute({
        id: 1,
        state: EnrollementState.PENDING,
        identityCardNumber: '1234567890',
        courseId: 1,
        levelId: 1,
      })
    ).rejects.toBeInstanceOf(CourseNotFoundError)
  })

  it('should throw LevelNotFoundError if level is not found', async () => {
    const student = await studentsRepository.create({
      id: 1,
      fullName: 'John Doe',
      dateOfBirth: new Date('2000-01-01'),
      email: 'john.doe@example.com',
      emissionDate: new Date(),
      expirationDate: new Date(),
      father: 'John Doe Sr.',
      gender: 'MALE',
      height: 1.75,
      identityCardNumber: '1234567890',
      maritalStatus: 'SINGLE',
      mother: 'Jane Doe',
      password: 'password123',
      residence: '123 Main St, City',
      phone: "1234567890",
      type: 'REGULAR',
      alternativePhone: "9876543210",
      provinceId: 1,
      countyId: 1,
    })

    const course = await coursesRepository.create({
      id: 1,
      name: 'Computer Science',
    })

    await expect(() =>
      sut.execute({
        id: 1,
        state: EnrollementState.PENDING,
        identityCardNumber: '1234567890',
        courseId: course.id,
        levelId: 1,
      })
    ).rejects.toBeInstanceOf(LevelNotFoundError)
  })

  it('should throw EnrollmentAlreadyExistsError if enrollment already exists', async () => {
    const student = await studentsRepository.create({
      id: 1,
      fullName: 'John Doe',
      dateOfBirth: new Date('2000-01-01'),
      email: 'john.doe@example.com',
      emissionDate: new Date(),
      expirationDate: new Date(),
      father: 'John Doe Sr.',
      gender: 'MALE',
      height: 1.75,
      identityCardNumber: '1234567890',
      maritalStatus: 'SINGLE',
      mother: 'Jane Doe',
      password: 'password123',
      residence: '123 Main St, City',
      phone: "1234567890",
      type: 'REGULAR',
      alternativePhone: "9876543210",
      provinceId: 1,
      countyId: 1,
    })

    const course = await coursesRepository.create({
      id: 1,
      name: 'Computer Science',
    })

    const level = await levelsRepository.create({
      id: 1,
      name: 'CLASS_10',
    })

    await enrollmentsRepository.create({
      id: 1,
      state: EnrollementState.PENDING,
      studentId: student.id,
      courseId: course.id,
      levelId: level.id,
      created_at: new Date(),
      update_at: new Date(),
    })

    await expect(() =>
      sut.execute({
        id: 2,
        state: EnrollementState.PENDING,
        identityCardNumber: '1234567890',
        courseId: course.id,
        levelId: level.id,
      })
    ).rejects.toBeInstanceOf(EnrollmentAlreadyExistsError)
  })
})
