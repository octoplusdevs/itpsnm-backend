export class PaymentItemNotFoundError extends Error {
  constructor(itemId: number) {
    super(`Payment item with id ${itemId} not found`);
  }
}
