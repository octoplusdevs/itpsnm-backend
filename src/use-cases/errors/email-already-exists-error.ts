export class EmailAlreadyExistsError extends Error {
  constructor() {
    super('E-mail already exists.')
  }
}
