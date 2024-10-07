export class IncorrectPasswordError extends Error {
  constructor() {
    super('Password is incorrect.')
  }
}
