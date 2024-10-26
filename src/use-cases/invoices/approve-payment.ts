import { PaymentRepository } from "@/repositories/payments-repository"
import { PAY_STATUS } from "@prisma/client"
import { PaymentNotFoundError } from "../errors/payment-not-found"
import { PaymentIsNotPendingError } from "../errors/payment-is-not-pending"
import { EmployeeRepository } from "@/repositories/employee-repository"
import { EmployeeNotFoundError } from "../errors/employee-not-found"
import { InvoiceItemRepository } from "@/repositories/invoices-item-repository"

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
  ) {}

  async execute(data: ApprovePaymentDTO) {
    const payment = await this.paymentRepository.findPaymentById(data.paymentId)
    if (!payment) {
      throw new PaymentNotFoundError()
    }

    const employee = await this.employeeRepository.findById(data.employeeId)
    if (!employee) {
      throw new EmployeeNotFoundError()
    }

    if (payment.status !== PAY_STATUS.PENDING && payment.status !== PAY_STATUS.RECUSED) {
      throw new PaymentIsNotPendingError()
    }

    const approvedPayment = await this.paymentRepository.approvePayment(data.paymentId, data.employeeId, data.status || "PAID")
    const items = await this.invoiceItemRepository.findInvoiceItemsByInvoiceId(payment.invoiceId)

    for (const item of items) {
      await this.invoiceItemRepository.updateInvoiceItem(item.id, {
        status: PAY_STATUS.PAID,
      });
    }

    return approvedPayment
  }
}
