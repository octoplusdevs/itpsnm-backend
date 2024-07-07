import { DocumentsRepository, DocumentsType } from '@/repositories/documents-repository'

interface CreateDocumentUseCaseRequest {
  id?: number
  enrollment_id: number
  created_at?: Date
  update_at?: Date
}
interface CreateDocumentUseCaseResponse {
  document: DocumentsType
}

export class CreateDocumentUseCase {
  constructor(private documentsRepository: DocumentsRepository) { }

  async execute({
    enrollment_id,
    created_at,
    id,
    update_at
  }: CreateDocumentUseCaseRequest): Promise<CreateDocumentUseCaseResponse> {
    const document = await this.documentsRepository.create({
      enrollment_id,
      created_at,
      id,
      update_at
    })

    return {
      document,
    }
  }
}
