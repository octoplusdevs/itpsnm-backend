import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryFilesRepository } from '@/repositories/in-memory/in-memory-files-repository';
import { FileFormat, FileType } from '@prisma/client';
import { UpdateFileUseCase } from './update-file';

describe('UpdateFileUseCase', () => {
  let updateFileUseCase: UpdateFileUseCase;
  let filesRepository: InMemoryFilesRepository;

  beforeEach(() => {
    filesRepository = new InMemoryFilesRepository();
    updateFileUseCase = new UpdateFileUseCase(filesRepository);
  });

  it('should update a file', async () => {
    const createdFile = await filesRepository.create({
      name: 'test-file',
      path: '/path/to/file',
      format: FileFormat.PDF,
      type: FileType.IDENTITY_CARD,
      studentId: 1,
    });

    const updatedFile = await updateFileUseCase.execute({
      id: createdFile.id,
      name: 'updated-file',
    });

    expect(updatedFile).not.toBeNull();
    expect(updatedFile?.name).toBe('updated-file');
  });
});
