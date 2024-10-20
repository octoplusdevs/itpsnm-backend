export class PaymentIsNotPendingError extends Error {
  constructor() {
    super('Payment is not pending approval')
  }
}
