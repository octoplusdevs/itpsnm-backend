import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { RegisterUseCase } from "../authenticate/register";

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUserRepository();
  const registerUseCase = new RegisterUseCase(usersRepository);

  return registerUseCase;
}
