import { PaymentRepository } from "@/repositories/payments-repository"
import { PAY_STATUS } from "@prisma/client"
import { PaymentNotFoundError } from "../errors/payment-not-found"
import { EmployeeRepository } from "@/repositories/employee-repository"
import { EmployeeNotFoundError } from "../errors/employee-not-found"
import { InvoiceItemRepository } from "@/repositories/invoices-item-repository"
import { InvoiceItemNotFoundError } from "../errors/invoice-item-not-found"
import { TransactionRepository } from "@/repositories/transaction-repository"
import { TransactionNotFoundError } from "../errors/transaction-not-found"
import { InvoiceRepository } from "@/repositories/invoices-repository"
import { InsufficientFoundsError } from "../errors/insuficient-founds"
import { UpdateStudentBalanceUseCase } from "./update-student-balance"
import { PrismaStudentBalanceRepository } from "@/repositories/prisma/prisma-balance-student-repository"

interface ApprovePaymentDTO {
  paymentId: number
  employeeId: number
  status: PAY_STATUS
}

export class ApprovePaymentUseCase {
  constructor(
    private paymentRepository: PaymentRepository,
    private employeeRepository: EmployeeRepository,
    private invoiceItemRepository: InvoiceItemRepository,
    private invoiceRepository: InvoiceRepository,
    private transactionRepository: TransactionRepository,
    private prismaStudentBalanceRepository: PrismaStudentBalanceRepository,
  ) { }

  async execute(data: ApprovePaymentDTO) {
    const payment = await this.paymentRepository.findPaymentById(data.paymentId)
    if (!payment) {
      throw new PaymentNotFoundError()
    }

    const employee = await this.employeeRepository.findById(data.employeeId)
    if (!employee) {
      throw new EmployeeNotFoundError()
    }

    // const transaction = await this.transactionRepository.findTransactionById(payment.transactionId!)
    // if (!transaction) {
    //   throw new TransactionNotFoundError()
    // }

    // if (payment.status !== PAY_STATUS.PENDING && payment.status !== PAY_STATUS.RECUSED) {
    //   throw new PaymentIsNotPendingError()
    // }
    let getAllTransanctionsPayment = await this.paymentRepository.findManyTransactionsByPaymentId(payment.id)
    let findTransanctionsPayment = await this.transactionRepository.findTransactionById(payment.transactionId!)
    let findInvoice = await this.invoiceRepository.findInvoiceById(payment.invoiceId)
    let totalTransaction = 0;

    for (const transaction of getAllTransanctionsPayment) {
      for(const tr of transaction.transactions || []){
        totalTransaction += Number(tr.amount);
      }
    }
    totalTransaction += Number(findTransanctionsPayment?.amount)


    if (totalTransaction < Number(findInvoice?.totalAmount)) {
      throw new InsufficientFoundsError()
    }

    const items = await this.invoiceItemRepository.findInvoiceItemsByInvoiceId(payment.invoiceId)

    if (!items) {
      throw new InvoiceItemNotFoundError()
    }
    for (const item of items) {
      await this.invoiceItemRepository.updateInvoiceItem(item.id, {
        status: data.status,
      });
    }
    // await this.transactionRepository.updateTransactionStatus(transaction.transactionNumber, true)
    await this.invoiceRepository.updateInvoiceStatus(payment.invoiceId, data.status)
    // Atualiza o saldo do estudante
    const UpdateBalance = new UpdateStudentBalanceUseCase(this.prismaStudentBalanceRepository)
    await UpdateBalance.execute({
      enrollmentId: payment.enrollmentId!,
      invoiceAmount: Number(payment.totalAmount), // Passamos o valor da fatura para ser deduzido do saldo
    });




    if(findInvoice?.type !== "ENROLLMENT" && findInvoice?.type !== "ENROLLMENT_CONFIRMATION"){
      await this.paymentRepository.updatePaymentUsed(payment.id, true)
    }

    const approvedPayment = await this.paymentRepository.approvePayment(data.paymentId, data.employeeId, data.status)
    return approvedPayment
  }
}
