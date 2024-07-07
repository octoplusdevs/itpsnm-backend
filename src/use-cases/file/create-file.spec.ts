import { expect, describe, it, beforeEach } from 'vitest'
import { CreateFileUseCase } from './create-file'
import { InMemoryFilesRepository } from '@/repositories/in-memory/in-memory-files-repository'

let filesRepository: InMemoryFilesRepository
let sut: CreateFileUseCase

describe('Create File Use Case', () => {
  beforeEach(() => {
    filesRepository = new InMemoryFilesRepository()
    sut = new CreateFileUseCase(filesRepository)
  })
  it('should be able to create file', async () => {
    const { file } = await sut.execute({
      format: "PDF",
      name: "relatorio",
      path: "local do ficheiro",
      studentId: 1,
      type:'REPORT_CARD',
    })

    expect(file.id).toEqual(expect.any(Number))
  })
})
