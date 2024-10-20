import { ItemPaymentDetailsRepository } from "@/repositories/payment-item-repository";
import { ItemPaymentDetail, PaymentType } from "@prisma/client";

interface CreateItemPaymentDetailRequest {
  type: PaymentType;
  quantity: number;
  price: number;
  paymentsId: number;
}

export class CreateItemPaymentDetailUseCase {
  constructor(private itemPaymentDetailsRepository: ItemPaymentDetailsRepository) { }

  async execute(request: CreateItemPaymentDetailRequest): Promise<ItemPaymentDetail> {
    const { type, quantity, price, paymentsId } = request;

    const itemDetail = await this.itemPaymentDetailsRepository.create({
      type,
      quantity,
      price,
      paymentsId,
    });

    return itemDetail;
  }
}
