import { FilesRepository } from '@/repositories/files-repository';
import { FileFormat, FileType } from '@prisma/client';

interface UpdateFileRequest {
  id: number;
  name?: string;
  path?: string;
  format?: FileFormat;
  type?: FileType;
}

class UpdateFileUseCase {
  constructor(private filesRepository: FilesRepository) { }

  async execute({ id, ...data }: UpdateFileRequest) {
    const updatedFile = await this.filesRepository.update(id, data);
    return updatedFile;
  }
}

export { UpdateFileUseCase };
