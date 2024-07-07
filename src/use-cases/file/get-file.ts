import { ResourceNotFoundError } from '../errors/resource-not-found'
import { FilesRepository, FilesType } from '@/repositories/files-repository'

interface GetFileUseCaseRequest {
  fileId: number
}

interface GetFileUseCaseResponse {
  file: FilesType | null
}

export class GetFileUseCase {
  constructor(private filesRepository: FilesRepository) { }

  async execute({
    fileId
  }: GetFileUseCaseRequest): Promise<GetFileUseCaseResponse> {
    const file = await this.filesRepository.findById(
      fileId
    )
    if (!file) {
      throw new ResourceNotFoundError()
    }

    return {
      file,
    }
  }
}
