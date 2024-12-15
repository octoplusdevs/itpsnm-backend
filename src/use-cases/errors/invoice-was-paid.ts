export class InvoiceWasPaidError extends Error {
  constructor() {
    super('Invoice was paid.')
  }
}
