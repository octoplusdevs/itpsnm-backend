export class AlternativePhoneAlreadyExistsError extends Error {
  constructor() {
    super('Alternative phone already exists.')
  }
}
