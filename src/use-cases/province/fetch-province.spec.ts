import { expect, describe, it, beforeEach } from 'vitest'
import { FetchProvinceUseCase } from './fetch-province'
import { InMemoryProvinceRepository } from '@/repositories/in-memory/in-memory-province-repository'

let provincesRepository: InMemoryProvinceRepository
let sut: FetchProvinceUseCase

describe('Fetch Province Use Case', () => {
  beforeEach(async () => {
    provincesRepository = new InMemoryProvinceRepository()
    sut = new FetchProvinceUseCase(provincesRepository)
  })

  it('should be able to fetch a province', async () => {
    await provincesRepository.create({
      name: 'Luanda',
    })

    await provincesRepository.create({
      name: 'Benguela',
    })

    const { provinces } = await sut.execute({
      name: 'Benguela',
      page: 1,
    })

    expect(provinces).toHaveLength(1)
    expect(provinces).toEqual([
      expect.objectContaining({ name: 'Benguela' }),
    ])
  })

  it('should be able to fetch paginated provinces', async () => {
    for (let i = 1; i <= 22; i++) {
      await provincesRepository.create({
        name: `province-${i}`,
      })
    }

    const { provinces } = await sut.execute({
      name: 'province',
      page: 2,
    })

    expect(provinces).toHaveLength(2)
    expect(provinces).toEqual([
      expect.objectContaining({ name: 'province-21' }),
      expect.objectContaining({ name: 'province-22' }),
    ])
  })
})
