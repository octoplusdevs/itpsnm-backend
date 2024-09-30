export class EmployeeOREnrollmentNotFoundError extends Error {
  constructor() {
    super('Employee or Enrollment not found.')
  }
}
