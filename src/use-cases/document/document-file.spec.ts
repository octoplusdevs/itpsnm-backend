import { expect, describe, it, beforeEach } from 'vitest'
import { CreateDocumentUseCase} from './document-file'
import { InMemoryDocumentsRepository } from '@/repositories/in-memory/in-memory-documents-repository'

let documentsRepository: InMemoryDocumentsRepository
let sut: CreateDocumentUseCase

describe('Create Document Use Case', () => {
  beforeEach(() => {
    documentsRepository = new InMemoryDocumentsRepository()
    sut = new CreateDocumentUseCase(documentsRepository)
  })
  it('should be able to create document', async () => {
    const { document } = await sut.execute({
      enrollment_id: 1,
    })

    expect(document.id).toEqual(expect.any(Number))
  })
})
