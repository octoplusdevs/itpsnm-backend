import { expect, describe, it, beforeEach } from 'vitest'
import { CreateProvinceUseCase } from './create-province'
import { InMemoryProvinceRepository } from '@/repositories/in-memory/in-memory-province-repository'
import { ProvinceAlreadyExistsError } from '../errors/province-already-exists-error'

let provincesRepository: InMemoryProvinceRepository
let sut: CreateProvinceUseCase

describe('Create Province Use Case', () => {
  beforeEach(() => {
    provincesRepository = new InMemoryProvinceRepository()
    sut = new CreateProvinceUseCase(provincesRepository)
  })
  it('should be able to create province', async () => {
    const { province } = await sut.execute({
      name: 'Luanda',
    })

    expect(province.id).toEqual(expect.any(Number))
  })
  it('should not be able to create province with some name', async () => {
    await sut.execute({
      name: 'Luanda',
    })


    await expect(
      sut.execute({
        name: 'Luanda',
      })
    ).rejects.toBeInstanceOf(ProvinceAlreadyExistsError)
  })
})
