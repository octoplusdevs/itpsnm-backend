import { FilesRepository } from '@/repositories/files-repository';
import { FileFormat, FileType } from '@prisma/client';

interface CreateFileRequest {
  name: string;
  path: string;
  format: FileFormat;
  type: FileType;
  identityCardNumber: string;
  documentId: number;
}

class CreateFileUseCase {
  constructor(private filesRepository: FilesRepository) { }

  async execute({ name, path, format, type, identityCardNumber,documentId }: CreateFileRequest) {

    const file = await this.filesRepository.create({
      name,
      path,
      format,
      type,
      identityCardNumber,
      documentId
    });

    return file;
  }
}

export { CreateFileUseCase };
