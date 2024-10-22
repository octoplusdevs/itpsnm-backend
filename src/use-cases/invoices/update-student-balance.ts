import { StudentBalanceRepository } from "@/repositories/student-balance-repository";
import { InsufficientFoundsError } from "../errors/insuficient-founds";

interface UpdateStudentBalanceDTO {
  enrollmentId: number;
  invoiceAmount: number;
}

export class UpdateStudentBalanceUseCase {
  constructor(private studentBalanceRepository: StudentBalanceRepository) {}

  async execute(data: UpdateStudentBalanceDTO) {
    const currentBalance = await this.studentBalanceRepository.getBalanceByStudent(data.enrollmentId);

    // Se currentBalance.balance for do tipo Decimal, converta para number
    const balance = currentBalance?.balance ? currentBalance.balance.toNumber() : 0;

    // Calcular o saldo restante (descontando o valor da fatura)
    const remainingBalance = balance - data.invoiceAmount;

    // Verifica se o saldo é insuficiente
    if (remainingBalance < 0) {
      throw new InsufficientFoundsError();
    }

    // Atualiza o saldo do estudante
    const updatedBalance = await this.studentBalanceRepository.updateStudentBalance(data.enrollmentId, remainingBalance);

    return updatedBalance;
  }
}
