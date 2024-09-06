export class NoteAlreadyExistsError extends Error {
  constructor() {
    super('Note already exists.')
  }
}
