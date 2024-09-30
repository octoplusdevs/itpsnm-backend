import { expect, describe, it, beforeEach } from 'vitest'
import { DestroyProvinceUseCase } from './destroy-province'
import { InMemoryProvinceRepository } from '@/repositories/in-memory/in-memory-province-repository'

let provincesRepository: InMemoryProvinceRepository
let sut: DestroyProvinceUseCase

describe('Destroy Province Use Case', () => {
  beforeEach(() => {
    provincesRepository = new InMemoryProvinceRepository()
    sut = new DestroyProvinceUseCase(provincesRepository)
  })
  it('should be able to destroy a province', async () => {
    await provincesRepository.create({
      id: 1,
      name: 'Luanda',
    })

    const response = await sut.execute({ id: 1 })

    expect(response).toBe(true)
  })
})
