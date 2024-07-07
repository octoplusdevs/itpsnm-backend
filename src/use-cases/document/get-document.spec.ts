import { expect, describe, it, beforeEach } from 'vitest'
import { GetDocumentUseCase } from './get-document'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { InMemoryDocumentsRepository } from '@/repositories/in-memory/in-memory-documents-repository'

let documentsRepository: InMemoryDocumentsRepository
let sut: GetDocumentUseCase

describe('Get Document Use Case', () => {
  beforeEach(async () => {
    documentsRepository = new InMemoryDocumentsRepository()
    sut = new GetDocumentUseCase(documentsRepository)
  })

  it('should be able to get a file by id', async () => {
    await documentsRepository.create({
      id: 3,
      enrollment_id: 1
    })

    const { document } = await sut.execute({
      documentId: 3
    })

    expect(document?.id).toEqual(3)
    expect(document?.enrollment_id).toEqual(1)
  })
  it('should not be able to get file with wrong id', async () => {
    await expect(() =>
      sut.execute({
        documentId: 1
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
