import { expect, describe, it, beforeEach } from 'vitest'
import { DestroyFileUseCase } from './destroy-file'
import { InMemoryFilesRepository } from '@/repositories/in-memory/in-memory-files-repository'

let filesRepository: InMemoryFilesRepository
let sut: DestroyFileUseCase

describe('Destroy File Use Case', () => {
  beforeEach(() => {
    filesRepository = new InMemoryFilesRepository()
    sut = new DestroyFileUseCase(filesRepository)
  })
  it('should be able to destroy a file', async () => {
    await filesRepository.create({
      id: 1,
      format: "PDF",
      name: "relatorio",
      path: "local do ficheiro",
      studentId: 1,
      type: 'REPORT_CARD',
    })

    expect(await sut.execute({ fileId: 1 })).toBe(true)
  })
})
