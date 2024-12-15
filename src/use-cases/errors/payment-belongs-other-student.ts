export class PaymentBelongsToAnotherStudentError extends Error {
  constructor() {
    super('The payment belongs to another student.');
  }
}
