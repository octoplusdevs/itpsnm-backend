import { DocumentsRepository } from "@/repositories/documents-repository"

interface DestroyDocumentsUseCaseRequest {
  documentId: number
}

export class DestroyDocumentsUseCase {
  constructor(private documentsRepository: DocumentsRepository) { }

  async execute({
    documentId,
  }: DestroyDocumentsUseCaseRequest): Promise<Boolean> {
    return await this.documentsRepository.destroy(
      documentId,
    )

  }
}
