export class PaymentNotPaidError extends Error {
  constructor(status: string) {
    super(`The payment status is ${status}`);
  }
}
