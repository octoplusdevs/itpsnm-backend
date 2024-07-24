import { StudentsRepository } from "@/repositories/student-repository";
import { StudentNotFoundError } from "../errors/student-not-found";
import { Payment, PaymentState, PaymentType } from "@prisma/client";
import { PaymentsRepository } from "@/repositories/payments-repository";

interface CreatePaymentRequest {
  identityCardNumber: string;
  state: PaymentState;
  date: Date;
  items: {
    type: PaymentType;
    quantity: number;
    price: number;
  }[];
}

export class CreatePaymentUseCase {
  constructor(
    private paymentsRepository: PaymentsRepository,
    private studentsRepository: StudentsRepository
  ) { }

  async execute(request: CreatePaymentRequest): Promise<Payment> {
    const { identityCardNumber, state, date, items } = request;

    const student = await this.studentsRepository.findByIdentityCardNumber(identityCardNumber)

    if (!student) {
      throw new StudentNotFoundError();
    }

    const amount_paid = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    const payment = await this.paymentsRepository.create(
      {
        identityCardNumber,
        state,
        amount_paid,
        date,
      },
      items.map(item => ({
        type: item.type,
        quantity: item.quantity,
        price: item.price,
      }))
    );

    return payment;
  }
}


