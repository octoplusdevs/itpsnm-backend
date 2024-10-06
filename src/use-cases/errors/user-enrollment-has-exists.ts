export class UserEnrollmentHasInUseError extends Error {
  constructor() {
    super('User Enrollment has in use.')
  }
}
