export class StudentCanOnlyChangeTheirPasswordError extends Error {
  constructor() {
    super('Students can only change their own password.')
  }
}
