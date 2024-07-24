import { InMemoryPaymentsRepository } from "@/repositories/in-memory/in-memory-payments-repository";
import { describe, expect, it } from "vitest";
import { DeletePaymentUseCase } from "./destroy-payment";
import { CreatePaymentUseCase } from "./create-payment";
import { PaymentState, PaymentType } from "@prisma/client";
import { InMemoryStudentRepository } from "@/repositories/in-memory/in-memory-students-repository";

describe('DeletePaymentUseCase', () => {
  it('should delete a payment by ID', async () => {
    const paymentsRepository = new InMemoryPaymentsRepository();
    const studentRepository = new InMemoryStudentRepository();
    const deletePaymentUseCase = new DeletePaymentUseCase(paymentsRepository);
    const createPaymentUseCase = new CreatePaymentUseCase(paymentsRepository, studentRepository);

    await studentRepository.create({
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

    const deleted = await deletePaymentUseCase.execute({ paymentId: payment.id });
    expect(deleted).toBe(true);

    const foundPayment = await paymentsRepository.findById(payment.id);
    expect(foundPayment).toBeNull();
  });
});
