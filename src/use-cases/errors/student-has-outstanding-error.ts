export class StudentHasOutstanding extends Error {
  constructor() {
    super("The student has outstanding enrollment debts.")
  }
}
