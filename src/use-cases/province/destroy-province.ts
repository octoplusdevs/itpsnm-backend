import { ProvincesRepository } from "@/repositories/province-repository"

interface DestroyProvinceUseCaseRequest {
  id: number
}

export class DestroyProvinceUseCase {
  constructor(private provincesRepository: ProvincesRepository) { }

  async execute({
    id,
  }: DestroyProvinceUseCaseRequest): Promise<Boolean> {
    return await this.provincesRepository.destroy(
      id,
    )
  }
}
