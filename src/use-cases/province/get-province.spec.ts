import { expect, describe, it, beforeEach } from 'vitest'
import { GetProvinceUseCase } from './get-province'
import { InMemoryProvinceRepository } from '@/repositories/in-memory/in-memory-province-repository'
import { ProvinceNotFoundError } from '../errors/province-not-found'

let provincesRepository: InMemoryProvinceRepository
let sut: GetProvinceUseCase

describe('Get Province Use Case', () => {
  beforeEach(async () => {
    provincesRepository = new InMemoryProvinceRepository()
    sut = new GetProvinceUseCase(provincesRepository)
  })

  it('should be able to get a province by id', async () => {
    await provincesRepository.create({
      id: 1,
      name: 'Luanda',
    })

    const { province } = await sut.execute({
      provinceId: 1
    })

    expect(province?.id).toEqual(1)
    expect(province?.name).toEqual('Luanda')
  })
  it('should not be able to get province with wrong id', async () => {
    await expect(() =>
      sut.execute({
        provinceId: -1,
      }),
    ).rejects.toBeInstanceOf(ProvinceNotFoundError)
  })
})
