export class IdentityCardNumberHasInUseExistsError extends Error {
  constructor() {
    super('Identity card number has in use.')
  }
}
