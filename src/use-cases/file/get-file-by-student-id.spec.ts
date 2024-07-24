import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryFilesRepository } from '@/repositories/in-memory/in-memory-files-repository';
import { FileFormat, FileType } from '@prisma/client';
import { GetFilesByStudentsIdentityCardNumberUseCase } from './get-file-by-student-id';

describe('GetFilesByStudentIdUseCase', () => {
  let getFilesByStudentsIdentityCardNumberUseCase: GetFilesByStudentsIdentityCardNumberUseCase;
  let filesRepository: InMemoryFilesRepository;

  beforeEach(() => {
    filesRepository = new InMemoryFilesRepository();
    getFilesByStudentsIdentityCardNumberUseCase = new GetFilesByStudentsIdentityCardNumberUseCase(filesRepository);
  });

  it('should get all files by student ID', async () => {
    await filesRepository.create({
      name: 'test-file-1',
      path: '/path/to/file1',
      format: FileFormat.PDF,
      type: FileType.IDENTITY_CARD,
      identityCardNumber: "12312",
      documentId: 1
    });
    await filesRepository.create({
      name: 'test-file-2',
      path: '/path/to/file2',
      format: FileFormat.PDF,
      type: FileType.TUITION_RECEIPT,
      identityCardNumber: "12312",
      documentId: 1
    });

    const files = await getFilesByStudentsIdentityCardNumberUseCase.execute({ identityCardNumber: "12312" });

    expect(files.length).toBe(2);
  });
});
