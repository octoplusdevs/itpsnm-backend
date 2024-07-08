export class CourseAlreadyExistsError extends Error {
  constructor() {
    super('Course name already exists.')
  }
}
