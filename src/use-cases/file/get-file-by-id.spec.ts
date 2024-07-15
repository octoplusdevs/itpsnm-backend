import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryFilesRepository } from '@/repositories/in-memory/in-memory-files-repository';
import { FileFormat, FileType } from '@prisma/client';
import { GetFileByIdUseCase } from './get-file-by-id';

describe('GetFileByIdUseCase', () => {
  let getFileByIdUseCase: GetFileByIdUseCase;
  let filesRepository: InMemoryFilesRepository;

  beforeEach(() => {
    filesRepository = new InMemoryFilesRepository();
    getFileByIdUseCase = new GetFileByIdUseCase(filesRepository);
  });

  it('should get a file by ID', async () => {
    const createdFile = await filesRepository.create({
      name: 'test-file',
      path: '/path/to/file',
      format: FileFormat.PDF,
      type: FileType.IDENTITY_CARD,
      studentId: 1,
    });

    const file = await getFileByIdUseCase.execute({ id: createdFile.id });

    expect(file).not.toBeNull();
    expect(file?.name).toBe('test-file');
  });
});
