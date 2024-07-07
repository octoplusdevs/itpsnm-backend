import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryDocumentsRepository } from '@/repositories/in-memory/in-memory-documents-repository'
import { DestroyDocumentsUseCase } from './destroy-document'

let DocumentsRepository: InMemoryDocumentsRepository
let sut: DestroyDocumentsUseCase

describe('Destroy Document Use Case', () => {
  beforeEach(() => {
    DocumentsRepository = new InMemoryDocumentsRepository()
    sut = new DestroyDocumentsUseCase(DocumentsRepository)
  })
  it('should be able to destroy a document', async () => {
    await DocumentsRepository.create({
      id: 1,
      enrollment_id: 1
    })

    expect(await sut.execute({ documentId: 1 })).toBe(true)
  })
})
