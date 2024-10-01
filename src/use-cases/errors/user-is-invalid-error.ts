export class UserInvalidError extends Error {
  constructor() {
    super('User is invalid.')
  }
}
