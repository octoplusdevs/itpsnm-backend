import { FilesRepository } from '@/repositories/files-repository';

interface DeleteFileRequest {
  id: number;
}

class DeleteFileUseCase {
  constructor(private filesRepository: FilesRepository) {}

  async execute({ id }: DeleteFileRequest) {
    await this.filesRepository.destroy(id);
  }
}

export { DeleteFileUseCase };
