export class InvoiceNotFoundError extends Error {
  constructor() {
    super('Invoice not found.')
  }
}
