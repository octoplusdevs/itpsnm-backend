export class InvoiceItemNotFoundError extends Error {
  constructor() {
    super('Invoice item not found.')
  }
}
