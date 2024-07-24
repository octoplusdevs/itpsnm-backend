import { PaymentsRepository } from "@/repositories/payments-repository";
import { Payment } from "@prisma/client";

interface FindPaymentByIdRequest {
  paymentId: number;
}

export class FindPaymentByIdUseCase {
  constructor(private paymentsRepository: PaymentsRepository) { }

  async execute(request: FindPaymentByIdRequest): Promise<Payment | null> {
    const { paymentId } = request;
    return await this.paymentsRepository.findById(paymentId);
  }
}
