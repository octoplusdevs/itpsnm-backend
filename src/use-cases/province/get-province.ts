import { Course } from '@prisma/client'
import { ProvincesRepository } from '@/repositories/province-repository'
import { ProvinceNotFoundError } from '../errors/province-not-found'

interface GetProvinceUseCaseRequest {
  provinceId: number
}

interface GetProvinceUseCaseResponse {
  province: Course | null
}

export class GetProvinceUseCase {
  constructor(private provincesRepository: ProvincesRepository) { }

  async execute({
    provinceId
  }: GetProvinceUseCaseRequest): Promise<GetProvinceUseCaseResponse> {
    const province = await this.provincesRepository.findById(
      provinceId
    )
    if (!province) {
      throw new ProvinceNotFoundError()
    }

    return {
      province,
    }
  }
}
