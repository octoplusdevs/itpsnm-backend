import { InvoiceRepository } from "@/repositories/invoices-repository";
import { PaymentItemRepository } from "@/repositories/payment-item-repository";
import { PAY_STATUS } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { PaymentItemNotFoundError } from "../errors/payment-item-not-found-error";

interface GenerateInvoiceDTO {
  enrollmentId: number
  items: { itemId: number; quantity: number; price: number }[]
}

export class GenerateInvoiceUseCase {
  constructor(
    private invoiceRepository: InvoiceRepository,
    private paymentItemRepository: PaymentItemRepository
  ) {}

  async execute(data: GenerateInvoiceDTO) {
    const items = await Promise.all(
      data.items.map(async (item) => {
        const paymentItem = await this.paymentItemRepository.findPaymentItemById(item.itemId)
        if (!paymentItem) {
          throw new PaymentItemNotFoundError(item.itemId)
        }

        return {
          itemId: paymentItem.id,
          quantity: item.quantity,
          price: item.price,
        }
      })
    )

    const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0)

    const invoice = await this.invoiceRepository.createInvoice({
      enrollmentId: data.enrollmentId,
      totalAmount: new Decimal(totalAmount),
      status: PAY_STATUS.PENDING,
      created_at: new Date(),
      update_at:  new Date(),
      dueDate: new Date(),
      issueDate:  new Date()
    })

    return invoice
  }
}
