import { InMemoryPaymentsRepository } from "@/repositories/in-memory/in-memory-payments-repository";
import { describe, expect, it } from "vitest";
import { FindPaymentByIdUseCase } from "./find-payment";
import { InMemoryStudentRepository } from "@/repositories/in-memory/in-memory-students-repository";
import { PaymentState, PaymentType } from "@prisma/client";
import { CreatePaymentUseCase } from "./create-payment";

describe('FindPaymentByIdUseCase', () => {
  it('should find a payment by ID', async () => {
    const paymentsRepository = new InMemoryPaymentsRepository();
    const studentsRepository = new InMemoryStudentRepository();
    const findPaymentByIdUseCase = new FindPaymentByIdUseCase(paymentsRepository);
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

    expect(payment.id).toEqual(expect.any(Number))
    expect(payment.state).toBe('PENDING')
  });
});
