import { describe, expect, it } from "vitest";
import { PaymentState, PaymentType } from "@prisma/client";
import { InMemoryPaymentsRepository } from "@/repositories/in-memory/in-memory-payments-repository";
import { CreatePaymentUseCase } from "./create-payment";
import { InMemoryStudentRepository } from "@/repositories/in-memory/in-memory-students-repository";

describe('CreatePaymentUseCase', () => {
  it('should create a payment with multiple items', async () => {
    const paymentsRepository = new InMemoryPaymentsRepository();
    const studentsRepository = new InMemoryStudentRepository();
    const createPaymentUseCase = new CreatePaymentUseCase(paymentsRepository, studentsRepository);
    await studentsRepository.create({
      fullName: "Wilmy Danguya",
      dateOfBirth: new Date("01/08/2000"),
      email: "daniel.yava16@gmail.com",
      emissionDate: new Date(),
      expirationDate: new Date(),
      father: "Alguem",
      gender: "MALE",
      height: 1.23,
      identityCardNumber: "123456789",
      maritalStatus: 'SINGLE',
      mother: "222",
      password: "2222",
      residence: "www",
      phone: "222222",
      type: 'SCHOLARSHIP',
      alternativePhone: "22222",
      provinceId: 1,
      countyId: 1,
      id: 1,
      created_at: new Date(),
      update_at: new Date()
    })

    const payment = await createPaymentUseCase.execute({
      identityCardNumber: "123456789",
      state: PaymentState.PENDING,
      date: new Date(),
      items: [
        { type: PaymentType.A, quantity: 2, price: 50 },
        { type: PaymentType.B, quantity: 1, price: 100 }
      ]
    });

    expect(payment).toBeDefined();
    expect(payment.identityCardNumber).toBe("123456789");
    expect(payment.state).toBe(PaymentState.PENDING);
    expect(payment.amount_paid).toBe(200); // 2 * 50 + 1 * 100
    expect(payment.date).toBeInstanceOf(Date);
    expect(payment.created_at).toBeInstanceOf(Date);
    expect(payment.update_at).toBeInstanceOf(Date);

    const storedPayment = await paymentsRepository.findById(payment.id);
    expect(storedPayment).toEqual(payment);

    const items = paymentsRepository.itemPaymentDetails.filter(item => item.paymentsId === payment.id);
    expect(items.length).toBe(2);
    expect(items).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: PaymentType.A, quantity: 2, price: 50 }),
      expect.objectContaining({ type: PaymentType.B, quantity: 1, price: 100 })
    ]));
  });
});
