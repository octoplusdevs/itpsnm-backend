import { InvoiceRepository } from "@/repositories/invoices-repository";
import { PaymentRepository } from "@/repositories/payments-repository";
import { TransactionRepository } from "@/repositories/transaction-repository";
import { PAY_STATUS } from "@prisma/client";
import { TransactionNotFoundError } from "../errors/transaction-not-found";
import { InvoiceNotFoundError } from "../errors/invoice-not-found";
import { PaymentAlreadyExistsError } from "../errors/payment-already-exists-error";
import { EnrollmentsRepository } from "@/repositories/enrollment-repository";
import { EnrollmentNotFoundError } from "../errors/enrollment-not-found";
import { InsufficientFoundsError } from "../errors/insuficient-founds";
import { StudentBalanceRepository } from "@/repositories/student-balance-repository";
import { UpdateStudentBalanceUseCase } from "./update-student-balance";
import { Decimal } from "@prisma/client/runtime/library";
import { TransactionWasUsedError } from "../errors/transaction-was-used-error";
import { EmployeeRepository } from "@/repositories/employee-repository";
import { EmployeeNotFoundError } from "../errors/employee-not-found";

interface RegisterPaymentDTO {
  enrollmentId: number;
  transactionNumber?: string;
  invoiceId: number;
  employeeId: number;
}

export class RegisterPaymentUseCase {
  constructor(
    private paymentRepository: PaymentRepository,
    private transactionRepository: TransactionRepository,
    private invoiceRepository: InvoiceRepository,
    private enrollmentsRepository: EnrollmentsRepository,
    private studentBalanceRepository: StudentBalanceRepository,
    private employeeRepository: EmployeeRepository,
  ) { }

  private updateStudentBalanceUseCase = new UpdateStudentBalanceUseCase(this.studentBalanceRepository)

  async execute({ employeeId, enrollmentId, invoiceId, transactionNumber }: RegisterPaymentDTO) {
    // Verifica se a matrícula existe e está ativa
    const findEnrollment = await this.enrollmentsRepository.checkStatus(enrollmentId);
    if (!findEnrollment) {
      throw new EnrollmentNotFoundError();
    }

    const findEmployee = await this.employeeRepository.findById(employeeId);
    if (!findEmployee) {
      throw new EmployeeNotFoundError();
    }

    // Verifica se a fatura existe
    const findInvoice = await this.invoiceRepository.findInvoiceById(invoiceId);
    if (!findInvoice) {
      throw new InvoiceNotFoundError();
    }

    // Verifica se o pagamento já existe
    const existingPayment = await this.paymentRepository.findByStudentAndInvoice(enrollmentId, invoiceId);
    if (existingPayment) {
      throw new PaymentAlreadyExistsError();
    }

    // Verifica se a transação existe
    let transaction = null
    if (transactionNumber) {
      transaction = await this.transactionRepository.findTransactionByNumber(transactionNumber);
      if (!transaction) {
        throw new TransactionNotFoundError();
      }

      if (transaction.used) {
        throw new TransactionWasUsedError();
      }

    }

    // Verifica se o estudante tem saldo suficiente
    const findBalance = await this.studentBalanceRepository.getBalanceByStudent(enrollmentId);
    const studentBalance = findBalance?.balance?.toNumber() ?? 0;

    // O valor da fatura é o que será deduzido do saldo
    const invoiceAmount = Number(findInvoice.totalAmount);

    if (studentBalance < invoiceAmount) {
      throw new InsufficientFoundsError();
    }

    // Cria o pagamento
    const payment = await this.paymentRepository.createPayment({
      enrollmentId,
      invoiceId,
      totalAmount: new Decimal(invoiceAmount),
      employeeId,
      transactionId: transaction ? transaction.id : null,
      status: PAY_STATUS.PENDING,
      created_at: new Date(),
      update_at: new Date(),
    });

    // Atualiza o saldo do estudante
    await this.updateStudentBalanceUseCase.execute({
      enrollmentId,
      invoiceAmount, // Passamos o valor da fatura para ser deduzido do saldo
    });

    // Atualiza o status da transação e da fatura
    if (transactionNumber) {
      await this.transactionRepository.updateTransactionStatus(transactionNumber, true);
    }
    await this.invoiceRepository.updateInvoiceStatus(invoiceId, PAY_STATUS.PAID);

    return payment;
  }
}
