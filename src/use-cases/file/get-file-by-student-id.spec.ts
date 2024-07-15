import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryFilesRepository } from '@/repositories/in-memory/in-memory-files-repository';
import { FileFormat, FileType } from '@prisma/client';
import { GetFilesByStudentIdUseCase } from './get-file-by-student-id';

describe('GetFilesByStudentIdUseCase', () => {
  let getFilesByStudentIdUseCase: GetFilesByStudentIdUseCase;
  let filesRepository: InMemoryFilesRepository;

  beforeEach(() => {
    filesRepository = new InMemoryFilesRepository();
    getFilesByStudentIdUseCase = new GetFilesByStudentIdUseCase(filesRepository);
  });

  it('should get all files by student ID', async () => {
    await filesRepository.create({
      name: 'test-file-1',
      path: '/path/to/file1',
      format: FileFormat.PDF,
      type: FileType.IDENTITY_CARD,
      studentId: 1,
    });
    await filesRepository.create({
      name: 'test-file-2',
      path: '/path/to/file2',
      format: FileFormat.PDF,
      type: FileType.TUITION_RECEIPT,
      studentId: 1,
    });

    const files = await getFilesByStudentIdUseCase.execute({ studentId: 1 });

    expect(files.length).toBe(2);
  });
});
