export class CourseNotFoundError extends Error {
  constructor() {
    super('Course not found.')
  }
}
