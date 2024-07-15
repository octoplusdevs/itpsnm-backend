import { FilesRepository } from '@/repositories/files-repository';

interface GetFilesByStudentIdRequest {
  studentId: number;
}

class GetFilesByStudentIdUseCase {
  constructor(private filesRepository: FilesRepository) {}

  async execute({ studentId }: GetFilesByStudentIdRequest) {
    const files = await this.filesRepository.findAllByStudentId(studentId);
    return files;
  }
}

export { GetFilesByStudentIdUseCase };
