import { CountyRepository } from '@/repositories/county-repository'
import { County } from '@prisma/client'

interface FetchCountyUseCaseRequest {
  name: string
  page: number
}

interface FetchCountyUseCaseResponse {
  counties: County[]
}

export class FetchCountyUseCase {
  constructor(private countiesRepository: CountyRepository) { }

  async execute({
    name,
    page
  }: FetchCountyUseCaseRequest): Promise<FetchCountyUseCaseResponse> {
    const counties = await this.countiesRepository.searchMany(
      name,
      page
    )

    return {
      counties,
    }
  }
}
