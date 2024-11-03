export class ConfirmationOnlyForStudentsEnrolled extends Error {
  constructor() {
    super('Confirmation Only For Students have Enrollment approved.')
  }
}
