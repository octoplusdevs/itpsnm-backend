export class IdentityCardNumberAlreadyExistsError extends Error {
  constructor() {
    super('Identity card number already exists.')
  }
}
