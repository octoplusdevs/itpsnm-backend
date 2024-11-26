import { TransactionRepository } from '@/repositories/transaction-repository';
import { Transaction } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { TransactionWasUsedError } from '../errors/transaction-was-used-error';
import { EmployeeRepository } from '@/repositories/employee-repository';
import { PaymentRepository } from '@/repositories/payments-repository';
import { EmployeeNotFoundError } from '../errors/employee-not-found';
import { EnrollmentNotFoundError } from '../errors/enrollment-not-found';
import { EnrollmentsRepository } from '@/repositories/enrollment-repository';
import { PaymentNotFoundError } from '../errors/payment-not-found';
import { UpdateStudentBalanceUseCase } from '../payment/update-student-balance';
import { StudentBalanceRepository } from '@/repositories/student-balance-repository';
import { TransactionAlreadyAssignedError } from '../errors/transaction-already-assigned-error';
import { TransactionBelongsToAnotherStudentError } from '../errors/transaction-belongs-to-another-student-error';

interface CreateTransactionDTO {
  transactionNumber: string;
  amount: number;
  date: Date;
  enrollmentId: number;
  paymentId?: number;
  employeeId: number;
}

export class CreateTransactionUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private employeeRepository: EmployeeRepository,
    private enrollmentsRepository: EnrollmentsRepository,
    private paymentRepository: PaymentRepository,
    private studentBalanceRepository: StudentBalanceRepository,
  ) { }
  async execute(data: CreateTransactionDTO): Promise<Transaction> {
    const transactionAlreadyExists = await this.transactionRepository.findTransactionByNumber(data.transactionNumber);
    if (transactionAlreadyExists) {
      if (transactionAlreadyExists?.enrollmentId !== data.enrollmentId) {
        throw new TransactionBelongsToAnotherStudentError();
      }
    }
    if (transactionAlreadyExists) {
      throw new TransactionWasUsedError();
    }

    const findEmployee = await this.employeeRepository.findById(data.employeeId);
    if (!findEmployee) {
      throw new EmployeeNotFoundError();
    }

    if (data.paymentId) {
      const findPayment = await this.paymentRepository.findPaymentById(data.paymentId);
      if (!findPayment) {
        throw new PaymentNotFoundError();
      }
    }

    const findEnrollment = await this.enrollmentsRepository.checkStatus(data.enrollmentId);
    if (!findEnrollment) {
      throw new EnrollmentNotFoundError();
    }



    const transaction = await this.transactionRepository.createTransaction({
      transactionNumber: data.transactionNumber,
      amount: new Decimal(data.amount),
      date: data.date,
      enrollmentId: data.enrollmentId,
      paymentId: data.paymentId ?? null,
      employeeId: data.employeeId,
      used: data.paymentId ? true : false
    });
    // Atualiza o saldo do estudante
    await this.studentBalanceRepository.increaseBalance(data.enrollmentId, data.amount);

    return transaction;
  }
}
