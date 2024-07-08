export class CountyNotFoundError extends Error {
  constructor() {
    super('County not found.')
  }
}
