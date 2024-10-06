export class UserEmployeeHasInUseError extends Error {
  constructor() {
    super('User Employee has in use.')
  }
}
