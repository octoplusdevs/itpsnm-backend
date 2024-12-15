export class PaymentWasUsedError extends Error {
  constructor() {
    super('The payment was used.');
  }
}
