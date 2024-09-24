import { CountyRepository } from '@/repositories/county-repository'
import { Course } from '@prisma/client'
import { CountyNotFoundError } from '../errors/county-not-found'

interface GetCountyUseCaseRequest {
  countyId: number
}

interface GetCountyUseCaseResponse {
  county: Course | null
}

export class GetCountyUseCase {
  constructor(private countyRepository: CountyRepository) { }

  async execute({
    countyId
  }: GetCountyUseCaseRequest): Promise<GetCountyUseCaseResponse> {
    const county = await this.countyRepository.findById(
      countyId
    )
    if (!county) {
      throw new CountyNotFoundError()
    }

    return {
      county,
    }
  }
}
