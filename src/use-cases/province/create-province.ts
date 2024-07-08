import { ProvincesRepository } from '@/repositories/province-repository'
import { Province } from '@prisma/client'
import { ProvinceAlreadyExistsError } from '../errors/province-already-exists-error'

interface CreateProvinceUseCaseRequest {
  name: string
}

interface CreateProvinceUseCaseResponse {
  province: Province
}

export class CreateProvinceUseCase {
  constructor(private provincesRepository: ProvincesRepository) { }

  async execute({
    name,
  }: CreateProvinceUseCaseRequest): Promise<CreateProvinceUseCaseResponse> {

    const findProvince = await this.provincesRepository.findByName(name)
    if(findProvince){
      throw new ProvinceAlreadyExistsError()
    }
    const province = await this.provincesRepository.create({
      name,
    })

    return {
      province,
    }
  }
}
