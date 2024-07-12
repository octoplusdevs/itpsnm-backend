export class EnrollmentAlreadyExistsError extends Error {
  constructor() {
    super('Enrollment already exists error.')
  }
}
