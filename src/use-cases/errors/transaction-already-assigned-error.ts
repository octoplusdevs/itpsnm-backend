export class TransactionAlreadyAssignedError extends Error {
  constructor() {
    super('This transaction is already assigned to another student.');
  }
}
