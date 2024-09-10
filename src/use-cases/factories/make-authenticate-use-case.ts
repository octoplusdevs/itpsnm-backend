import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { LoginUseCase } from "../authenticate/authenticate";

export function makeLoginUseCase(): LoginUseCase {
  const usersRepository = new PrismaUserRepository();
  return new LoginUseCase(usersRepository);
}
