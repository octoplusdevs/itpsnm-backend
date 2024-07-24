import { InMemoryPaymentsRepository } from "@/repositories/in-memory/in-memory-payments-repository";
import { describe, expect, it } from "vitest";
import { FindPaymentByIdUseCase } from "./find-payment";

describe('FindPaymentByIdUseCase', () => {
  it('should find a payment by ID', async () => {
    const paymentsRepository = new InMemoryPaymentsRepository();
    const findPaymentByIdUseCase = new FindPaymentByIdUseCase(paymentsRepository);

    const payment = await paymentsRepository.create({
      identityCardNumber: "123456789",
      state: "PENDING",
      amount_paid: 100,
      date: new Date(),
    });

    const foundPayment = await findPaymentByIdUseCase.execute({ paymentId: payment.id });
    expect(foundPayment).toEqual(payment);
  });
});
