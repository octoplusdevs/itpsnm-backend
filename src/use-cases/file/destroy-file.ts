import { FilesRepository } from "@/repositories/files-repository"

interface DestroyFileUseCaseRequest {
  fileId: number
}

export class DestroyFileUseCase {
  constructor(private filesRepository: FilesRepository) { }

  async execute({
    fileId,
  }: DestroyFileUseCaseRequest): Promise<Boolean> {
    return await this.filesRepository.destroy(
      fileId,
    )

  }
}
