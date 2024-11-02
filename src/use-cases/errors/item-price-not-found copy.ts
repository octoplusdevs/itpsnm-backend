export class ItemPriceNotFoundError extends Error {
  constructor() {
    super('Item Price not found.')
  }
}
