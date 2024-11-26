export class TransactionBelongsToAnotherStudentError extends Error {
  constructor() {
    super('This transaction belongs to another student.');
  }
}
