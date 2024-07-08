import { PrismaProvincesRepository } from "@/repositories/prisma/prisma-province-repository"
import { CreateProvinceUseCase } from "../province/create-province"

export function makeProvinceUseCase() {
  const prismaProvincesRepository = new PrismaProvincesRepository()
  const createProvinceUseCase = new CreateProvinceUseCase(prismaProvincesRepository)

  return createProvinceUseCase
}
