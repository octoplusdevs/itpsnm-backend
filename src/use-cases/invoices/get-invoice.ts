import { Invoice, InvoiceType, PAY_STATUS } from '@prisma/client'
import { InvoiceRepository } from '@/repositories/invoices-repository'
import { InvoiceNotFoundError } from '../errors/invoice-not-found'

interface GetInvoiceUseCaseRequest {
  enrollmentId: number
  type: InvoiceType
  status: PAY_STATUS
}

interface GetInvoiceUseCaseResponse {
  invoice: Invoice[] | null
}

export class GetInvoiceByEnrollmentIdUseCase {
  constructor(private invoiceRepository: InvoiceRepository) { }

  async execute({
    enrollmentId,
    status,
    type
  }: GetInvoiceUseCaseRequest): Promise<GetInvoiceUseCaseResponse> {
    const invoice = await this.invoiceRepository.findInvoicesByStudentAndType(
      enrollmentId, type, status
    )
    if (!invoice) {
      throw new InvoiceNotFoundError()
    }

    return {
      invoice,
    }
  }
}
