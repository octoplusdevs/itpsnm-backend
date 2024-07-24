import { FilesRepository } from '@/repositories/files-repository';

interface GetFilesByStudentIdentityCardNumberRequest {
  identityCardNumber: string;
}

class GetFilesByStudentsIdentityCardNumberUseCase {
  constructor(private filesRepository: FilesRepository) {}

  async execute({ identityCardNumber }: GetFilesByStudentIdentityCardNumberRequest) {
    const files = await this.filesRepository.findAllFilesStudentByIdentityCardNumber(identityCardNumber);
    return files;
  }
}

export { GetFilesByStudentsIdentityCardNumberUseCase };
