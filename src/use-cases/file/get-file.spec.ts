import { expect, describe, it, beforeEach } from 'vitest'
import { GetFileUseCase } from './get-file'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { InMemoryFilesRepository } from '@/repositories/in-memory/in-memory-files-repository'

let filesRepository: InMemoryFilesRepository
let sut: GetFileUseCase

describe('Get File Use Case', () => {
  beforeEach(async () => {
    filesRepository = new InMemoryFilesRepository()
    sut = new GetFileUseCase(filesRepository)
  })

  it('should be able to get a file by id', async () => {
    await filesRepository.create({
      id: 3,
      name: 'file 01',
      format: 'DOCX',
      path: 'local',
      studentId: 1,
      type: 'IDENTITY_CARD'
    })

    const { file } = await sut.execute({
      fileId: 3
    })

    expect(file?.id).toEqual(3)
    expect(file?.name).toEqual('file 01')
    expect(file?.format).toEqual('DOCX')
  })
  it('should not be able to get file with wrong id', async () => {
    await expect(() =>
      sut.execute({
        fileId: 1
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
