export class IdentityCardNumberNotExistsError extends Error {
  constructor() {
    super('Identity card number not exists.')
  }
}
