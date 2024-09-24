export class CountyAlreadyExistsError extends Error {
  constructor() {
    super('County already exists.')
  }
}
