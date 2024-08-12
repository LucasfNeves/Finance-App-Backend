export class EmailAlreadyInUseError extends Error {
  constructor(email) {
    super(`The provided e-mail ${email} is already in use`)
    this.name = 'EmailAlreadyInUseError'
  }
}

export class UserNotFoundError extends Error {
  constructor(userID) {
    super(`user with  id ${userID} not found.`)
    this.name = 'UserNotFounderror'
  }
}
