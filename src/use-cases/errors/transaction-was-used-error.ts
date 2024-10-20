export class TransactionWasUsedError extends Error {
  constructor() {
    super('Transaction was used by another student.')
  }
}
