import { describe, it, expect, beforeEach } from 'vitest';
import { EnrollementState, FileFormat, FileType } from '@prisma/client';
import { CreateDocumentWithFilesUseCase } from './create-document-with-files';
import { InMemoryFilesRepository } from '@/repositories/in-memory/in-memory-files-repository';
import { InMemoryDocumentsRepository } from '@/repositories/in-memory/in-memory-documents-repository';
import { InMemoryEnrollmentRepository } from '@/repositories/in-memory/in-memory-enrollments-repository';
import { InMemoryStudentRepository } from '@/repositories/in-memory/in-memory-students-repository';
import { InMemoryLevelsRepository } from '@/repositories/in-memory/in-memory-level-repository';
import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository copy';

describe('Create Document With Files Use Case', () => {
  let documentRepository: InMemoryDocumentsRepository;
  let fileRepository: InMemoryFilesRepository;
  let enrollmentRepository: InMemoryEnrollmentRepository;
  let createDocumentWithFilesUseCase: CreateDocumentWithFilesUseCase;
  let studentsRepository: InMemoryStudentRepository
  let levelsRepository: InMemoryLevelsRepository
  let coursesRepository: InMemoryCoursesRepository

  beforeEach(() => {
    documentRepository = new InMemoryDocumentsRepository();
    fileRepository = new InMemoryFilesRepository();
    enrollmentRepository = new InMemoryEnrollmentRepository();
    levelsRepository = new InMemoryLevelsRepository();
    coursesRepository = new InMemoryCoursesRepository();
    studentsRepository = new InMemoryStudentRepository();
    createDocumentWithFilesUseCase = new CreateDocumentWithFilesUseCase(documentRepository, fileRepository, enrollmentRepository);
  });

  it('should be able to create a document with multiple files', async () => {

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

    await enrollmentRepository.create({
      id: 1,
      state: EnrollementState.PENDING,
      identityCardNumber: student.identityCardNumber,
      courseId: course.id,
      levelId: level.id,
    })

    const { document, files } = await createDocumentWithFilesUseCase.execute({
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

    expect(document).toHaveProperty('id');
    expect(files.length).toBe(2);
    expect(files[0].documentId).toEqual(document.id);
    expect(files[1].documentId).toEqual(document.id);
  });
});
