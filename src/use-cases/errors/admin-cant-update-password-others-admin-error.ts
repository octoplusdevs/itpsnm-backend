export class AdminCantChangeOtherAdminsPasswordError extends Error {
  constructor() {
    super('Admins cannot change other admins\' passwords.')
  }
}
