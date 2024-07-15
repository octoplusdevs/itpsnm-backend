import { FilesRepository } from '@/repositories/files-repository';
import { FileFormat, FileType } from '@prisma/client';

interface CreateFileRequest {
  name: string;
  path: string;
  format: FileFormat;
  type: FileType;
  studentId: number;
}

class CreateFileUseCase {
  constructor(private filesRepository: FilesRepository) { }

  async execute({ name, path, format, type, studentId }: CreateFileRequest) {
    const file = await this.filesRepository.create({
      name,
      path,
      format,
      type,
      studentId,
    });

    return file;
  }
}

export { CreateFileUseCase };
