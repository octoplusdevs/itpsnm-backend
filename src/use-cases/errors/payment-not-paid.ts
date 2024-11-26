export class PaymentNotPaidError extends Error {
  constructor() {
    super('The payment status is not PAID.');
  }
}
