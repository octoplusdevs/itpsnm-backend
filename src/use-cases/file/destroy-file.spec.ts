import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryFilesRepository } from '@/repositories/in-memory/in-memory-files-repository';
import { FileFormat, FileType } from '@prisma/client';
import { DeleteFileUseCase } from './destroy-file';

describe('DeleteFileUseCase', () => {
  let deleteFileUseCase: DeleteFileUseCase;
  let filesRepository: InMemoryFilesRepository;

  beforeEach(() => {
    filesRepository = new InMemoryFilesRepository();
    deleteFileUseCase = new DeleteFileUseCase(filesRepository);
  });

  it('should delete a file', async () => {
    const createdFile = await filesRepository.create({
      name: 'test-file',
      path: '/path/to/file',
      format: FileFormat.PDF,
      type: FileType.IDENTITY_CARD,
      studentId: 1,
    });

    await deleteFileUseCase.execute({ id: createdFile.id });

    const file = await filesRepository.findById(createdFile.id);
    expect(file).toBeNull();
  });
});
