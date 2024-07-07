import { DocumentsRepository, DocumentsType } from '@/repositories/documents-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'

interface GetDocumentUseCaseRequest {
  documentId: number
}

interface GetDocumentUseCaseResponse {
  document: DocumentsType | null
}

export class GetDocumentUseCase {
  constructor(private filesRepository: DocumentsRepository) { }

  async execute({
    documentId
  }: GetDocumentUseCaseRequest): Promise<GetDocumentUseCaseResponse> {
    const document = await this.filesRepository.findById(
      documentId
    )
    if (!document) {
      throw new ResourceNotFoundError()
    }

    return {
      document,
    }
  }
}
