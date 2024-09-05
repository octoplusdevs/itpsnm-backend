import { expect, describe, it, beforeEach } from 'vitest'
import { GetDocumentUseCase } from './get-document'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { InMemoryDocumentsRepository } from '@/repositories/in-memory/in-memory-documents-repository'
import { CreateDocumentWithFilesUseCase } from './create-document-with-files'
import { FileFormat, FileType } from '@prisma/client'
import { InMemoryFilesRepository } from '@/repositories/in-memory/in-memory-files-repository'
import { InMemoryEnrollmentRepository } from '@/repositories/in-memory/in-memory-enrollments-repository'
import { InMemoryStudentRepository } from '@/repositories/in-memory/in-memory-students-repository'
import { InMemoryLevelsRepository } from '@/repositories/in-memory/in-memory-level-repository'
import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'

let filesRepository: InMemoryFilesRepository
let documentsRepository: InMemoryDocumentsRepository
let studentsRepository: InMemoryStudentRepository
let levelsRepository: InMemoryLevelsRepository
let coursesRepository: InMemoryCoursesRepository
let enrollmentsRepository: InMemoryEnrollmentRepository
let createDocumentWithFilesUseCase: CreateDocumentWithFilesUseCase
let sut: GetDocumentUseCase

describe('Get Document Use Case', () => {
  beforeEach(async () => {
    documentsRepository = new InMemoryDocumentsRepository();
    filesRepository = new InMemoryFilesRepository();
    enrollmentsRepository = new InMemoryEnrollmentRepository();
    levelsRepository = new InMemoryLevelsRepository();
    coursesRepository = new InMemoryCoursesRepository();
    studentsRepository = new InMemoryStudentRepository();

    documentsRepository = new InMemoryDocumentsRepository()
    filesRepository = new InMemoryFilesRepository()
    enrollmentsRepository = new InMemoryEnrollmentRepository()
    sut = new GetDocumentUseCase(documentsRepository)
    createDocumentWithFilesUseCase = new CreateDocumentWithFilesUseCase(documentsRepository, filesRepository, enrollmentsRepository)
  })

  it('should be able to get a document by id', async () => {
    await studentsRepository.create({
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
      created_at: new Date(),
      update_at: new Date(),
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
      identityCardNumber: '1234567890',
      courseId: course.id,
      levelId: level.id,
      created_at: new Date(),
      update_at: new Date(),
      docsState: 'PENDING',
      paymentState: 'PENDING'
    })

    await createDocumentWithFilesUseCase.execute({
      enrollmentId: 1,
      files: [
        {
          name: 'file1.txt',
          path: '/path/to/file1.txt',
          format: FileFormat.PDF,
          type: FileType.REPORT_CARD,
          identityCardNumber: "1",
        },
        {
          name: 'file2.txt',
          path: '/path/to/file2.txt',
          format: FileFormat.PDF,
          type: FileType.IDENTITY_CARD,
          identityCardNumber: "1",
        },
      ],
    });

    const { document } = await sut.execute({
      documentId: 1
    })

    expect(document?.id).toEqual(1)
    expect(document?.enrollmentId).toEqual(1)
  })
  it('should not be able to get file with wrong id', async () => {
    await expect(() =>
      sut.execute({
        documentId: 1
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
