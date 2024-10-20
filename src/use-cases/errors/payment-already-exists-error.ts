export class PaymentAlreadyExistsError extends Error {
  constructor() {
    super('Payment already exists.')
  }
}
