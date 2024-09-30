export class EmployeeNotFoundError extends Error {
  constructor() {
    super('Employee not found.')
  }
}
