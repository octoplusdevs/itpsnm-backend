import { PaymentRepository } from "@/repositories/payments-repository"
import { PAY_STATUS } from "@prisma/client"
import { PaymentNotFoundError } from "../errors/payment-not-found"
import { PaymentIsNotPendingError } from "../errors/payment-is-not-pending"

interface ApprovePaymentDTO {
  paymentId: number
  employeeId: number
}

export class ApprovePaymentUseCase {
  constructor(private paymentRepository: PaymentRepository) {}

  async execute(data: ApprovePaymentDTO) {
    const payment = await this.paymentRepository.findPaymentById(data.paymentId)
    if (!payment) {
      throw new PaymentNotFoundError()
    }

    if (payment.status !== PAY_STATUS.PENDING) {
      throw new PaymentIsNotPendingError()
    }

    const approvedPayment = await this.paymentRepository.approvePayment(data.paymentId, data.employeeId)
    return approvedPayment
  }
}
