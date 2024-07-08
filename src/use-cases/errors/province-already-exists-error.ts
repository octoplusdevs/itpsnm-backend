export class ProvinceAlreadyExistsError extends Error {
  constructor() {
    super('Province already exists.')
  }
}
