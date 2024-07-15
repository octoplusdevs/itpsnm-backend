import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryFilesRepository } from '@/repositories/in-memory/in-memory-files-repository';
import { FileFormat, FileType } from '@prisma/client';
import { CreateFileUseCase } from './create-file';

describe('CreateFileUseCase', () => {
  let createFileUseCase: CreateFileUseCase;
  let filesRepository: InMemoryFilesRepository;

  beforeEach(() => {
    filesRepository = new InMemoryFilesRepository();
    createFileUseCase = new CreateFileUseCase(filesRepository);
  });

  it('should create a new file', async () => {
    const file = await createFileUseCase.execute({
      name: 'test-file',
      path: '/path/to/file',
      format: FileFormat.PDF,
      type: FileType.TUITION_RECEIPT,
      studentId: 1,
    });

    expect(file).toHaveProperty('id');
    expect(file.name).toBe('test-file');
  });
});
