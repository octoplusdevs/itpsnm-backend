import { CountyRepository } from "@/repositories/county-repository";
import { CountyNotFoundError } from "../errors/county-not-found";

interface DestroyCountyUseCaseRequest {
  id: number
}

export class DestroyCountyUseCase {
  constructor(private countiesRepository: CountyRepository) { }

  async execute({
    id,
  }: DestroyCountyUseCaseRequest): Promise<Boolean> {

    let findCounty = await this.countiesRepository.findById(id)
    if(!findCounty){
      throw new CountyNotFoundError();
    }
    return await this.countiesRepository.destroy(
      id,
    )
  }
}
