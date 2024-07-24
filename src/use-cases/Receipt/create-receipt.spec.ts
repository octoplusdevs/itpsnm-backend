import { InMemoryReceiptsRepository } from "@/repositories/in-memory/in-memory-receipt-repository";
import { describe, expect, it } from "vitest";
import { CreateReceiptUseCase } from "./create-receipt";

describe('CreateReceiptUseCase', () => {
  it('should create a receipt', async () => {
    const receiptsRepository = new InMemoryReceiptsRepository();
    const createReceiptUseCase = new CreateReceiptUseCase(receiptsRepository);

    const receipt = await createReceiptUseCase.execute({
      tuition_id: 1,
      path: "/path/to/receipt.pdf",
      payment_id: 1
    });

    expect(receipt).toBeDefined();
    expect(receipt.tuition_id).toBe(1);
    expect(receipt.path).toBe("/path/to/receipt.pdf");
    expect(receipt.payment_id).toBe(1);
    expect(receipt.created_at).toBeInstanceOf(Date);
    expect(receipt.update_at).toBeInstanceOf(Date);

    const storedReceipt = await receiptsRepository.findById(receipt.id);
    expect(storedReceipt).toEqual(receipt);
  });
});
