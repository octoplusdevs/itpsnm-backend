export class PhoneAlreadyExistsError extends Error {
  constructor() {
    super('Phone already exists.')
  }
}
