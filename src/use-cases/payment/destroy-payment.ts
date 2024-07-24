import { PaymentsRepository } from "@/repositories/payments-repository";

interface DeletePaymentRequest {
  paymentId: number;
}

export class DeletePaymentUseCase {
  constructor(private paymentsRepository: PaymentsRepository) {}

  async execute(request: DeletePaymentRequest): Promise<boolean> {
    const { paymentId } = request;
    return await this.paymentsRepository.destroy(paymentId);
  }
}
