import { PaymentRepository } from "@/repositories/payments-repository"
import { PAY_STATUS } from "@prisma/client"
import { PaymentNotFoundError } from "../errors/payment-not-found"
import { EmployeeRepository } from "@/repositories/employee-repository"
import { EmployeeNotFoundError } from "../errors/employee-not-found"
import { InvoiceItemRepository } from "@/repositories/invoices-item-repository"
import { InvoiceItemNotFoundError } from "../errors/invoice-item-not-found"

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

    // if (payment.status !== PAY_STATUS.PENDING && payment.status !== PAY_STATUS.RECUSED) {
    //   throw new PaymentIsNotPendingError()
    // }
    const items = await this.invoiceItemRepository.findInvoiceItemsByInvoiceId(payment.invoiceId)
    if (!items) {
      throw new InvoiceItemNotFoundError()
    }
    for (const item of items) {
      await this.invoiceItemRepository.updateInvoiceItem(item.id, {
        status: PAY_STATUS.PAID,
      });
    }

    const approvedPayment = await this.paymentRepository.approvePayment(data.paymentId, data.employeeId, data.status || "PAID")
    return approvedPayment
  }
}
