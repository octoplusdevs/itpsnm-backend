import { describe, expect, it } from "vitest";
import { PaymentType } from "@prisma/client";
import { InMemoryItemPaymentDetailsRepository } from "@/repositories/in-memory/in-memory-item-payment-detail-repository";
import { CreateItemPaymentDetailUseCase } from "./create-item-payment-detail";

describe('CreateItemPaymentDetailUseCase', () => {
  it('should create an item payment detail', async () => {
    const itemPaymentDetailsRepository = new InMemoryItemPaymentDetailsRepository();
    const createItemPaymentDetailUseCase = new CreateItemPaymentDetailUseCase(itemPaymentDetailsRepository);

    const itemDetail = await createItemPaymentDetailUseCase.execute({
      type: PaymentType.A,
      quantity: 2,
      price: 50,
      paymentsId: 1
    });

    expect(itemDetail).toBeDefined();
    expect(itemDetail.type).toBe(PaymentType.A);
    expect(itemDetail.quantity).toBe(2);
    expect(itemDetail.price).toBe(50);
    expect(itemDetail.paymentsId).toBe(1);
    expect(itemDetail.created_at).toBeInstanceOf(Date);
    expect(itemDetail.update_at).toBeInstanceOf(Date);

    const storedItemDetail = await itemPaymentDetailsRepository.findByPaymentId(itemDetail.paymentsId!);
    expect(storedItemDetail).toContainEqual(itemDetail);
  });
});
