import { ProvincesRepository } from "@/repositories/province-repository"
import { ProvinceNotFoundError } from "../errors/province-not-found"

interface DestroyProvinceUseCaseRequest {
  id: number
}

export class DestroyProvinceUseCase {
  constructor(private provincesRepository: ProvincesRepository) { }

  async execute({
    id,
  }: DestroyProvinceUseCaseRequest): Promise<Boolean> {

    let findProvince = await this.provincesRepository.findById(id)
    if(!findProvince){
      throw new ProvinceNotFoundError();
    }
    return await this.provincesRepository.destroy(
      id,
    )
  }
}
