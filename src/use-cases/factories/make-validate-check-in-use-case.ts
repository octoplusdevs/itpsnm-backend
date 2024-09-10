import { PrismaCheckinsRepository } from '@/repositories/prisma/prisma-user-repository'
import { ValidateCheckInUseCase } from '../validate-check-in'

export function makeValidateCheckInUseCase() {
  const checkInsRepository = new PrismaCheckinsRepository()
  const useCase = new ValidateCheckInUseCase(checkInsRepository)

  return useCase
}
