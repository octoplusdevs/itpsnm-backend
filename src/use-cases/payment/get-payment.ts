import { Payment } from '@prisma/client'
import { ProvinceNotFoundError } from '../errors/province-not-found'
import { PaymentRepository } from '@/repositories/payments-repository'
import { PaymentNotFoundError } from '../errors/payment-not-found'

interface GetPaymentUseCaseRequest {
  paymentId: number
}

interface GetPaymentCaseResponse {
  payment: Payment | null
}

export class GetPaymentUseCase {
  constructor(private paymentRepository: PaymentRepository) { }

  async execute({
    paymentId
  }: GetPaymentUseCaseRequest): Promise<GetPaymentCaseResponse> {
    const payment = await this.paymentRepository.findPaymentById(
      paymentId
    )
    if (!payment) {
      throw new PaymentNotFoundError()
    }

    return {
      payment,
    }
  }
}
