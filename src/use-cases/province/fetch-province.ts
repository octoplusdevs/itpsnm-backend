import { ProvincesRepository } from '@/repositories/province-repository'
import { Province } from '@prisma/client'

interface FetchProvinceUseCaseRequest {
  name: string
  page: number
}

interface FetchProvinceUseCaseResponse {
  provinces: Province[]
}

export class FetchProvinceUseCase {
  constructor(private provincesRepository: ProvincesRepository) { }

  async execute({
    name,
    page
  }: FetchProvinceUseCaseRequest): Promise<FetchProvinceUseCaseResponse> {
    const provinces = await this.provincesRepository.searchMany(
      name,
      page
    )

    return {
      provinces,
    }
  }
}
