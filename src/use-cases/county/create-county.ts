import { CountyRepository } from '@/repositories/county-repository'
import { County } from '@prisma/client'
import { CountyAlreadyExistsError } from '../errors/county-already-exists-error'

interface CreateCountyUseCaseRequest {
  name: string
}

interface CreateCountyUseCaseResponse {
  province: County
}

export class CreateCountyUseCase {
  constructor(private countyRepository: CountyRepository) { }

  async execute({
    name,
  }: CreateCountyUseCaseRequest): Promise<CreateCountyUseCaseResponse> {

    const findCounty = await this.countyRepository.findByName(name)
    if(findCounty){
      throw new CountyAlreadyExistsError()
    }
    const province = await this.countyRepository.create({
      name,
    })

    return {
      province,
    }
  }
}
