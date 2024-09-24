import { PrismaCountyRepository } from "@/repositories/prisma/prisma-county-repository"
import { CreateCountyUseCase } from "../county/create-county"

export function makeCountyUseCase() {
  const prismaCountyRepository = new PrismaCountyRepository()
  const createCountyUseCase = new CreateCountyUseCase(prismaCountyRepository)

  return createCountyUseCase
}
