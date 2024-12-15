import { Invoice } from '@prisma/client'
import { InvoiceRepository } from '@/repositories/invoices-repository'
import { InvoiceNotFoundError } from '../errors/invoice-not-found'

interface FindInvoiceUseCaseRequest {
  invoiceId: number
}

interface FindInvoiceUseCaseResponse {
  invoice: Invoice | null
}

export class FindInvoiceUseCase {
  constructor(private invoiceRepository: InvoiceRepository) { }

  async execute({
    invoiceId,
  }: FindInvoiceUseCaseRequest): Promise<FindInvoiceUseCaseResponse> {
    const invoice = await this.invoiceRepository.findInvoiceById(invoiceId)
    if (!invoice) {
      throw new InvoiceNotFoundError()
    }

    return {
      invoice,
    }
  }
}
