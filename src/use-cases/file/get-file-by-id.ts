import { FilesRepository } from '@/repositories/files-repository';

interface GetFileByIdRequest {
  id: number;
}

class GetFileByIdUseCase {
  constructor(private filesRepository: FilesRepository) {}

  async execute({ id }: GetFileByIdRequest) {
    const file = await this.filesRepository.findById(id);
    return file;
  }
}

export { GetFileByIdUseCase };
