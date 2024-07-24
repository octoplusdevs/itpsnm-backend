import { DocumentsRepository } from '@/repositories/documents-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { Document } from '@prisma/client'

interface GetDocumentUseCaseRequest {
  documentId: number
}

interface GetDocumentUseCaseResponse {
  document: Document | null
}

export class GetDocumentUseCase {
  constructor(private documentsRepository: DocumentsRepository) { }

  async execute({
    documentId
  }: GetDocumentUseCaseRequest): Promise<GetDocumentUseCaseResponse> {
    const document = await this.documentsRepository.findById(
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
