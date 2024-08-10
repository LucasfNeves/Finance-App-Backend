import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
  userNotFound,
  ok,
  serverError,
} from './helpers/index.js'

export class DeleteUserController {
  constructor(deleteUserUseCase) {
    this.deleteUserUseCase = deleteUserUseCase
  }
  async execute(httpRequest) {
    try {
      const { userId } = httpRequest.params

      const isIdValid = checkIfIdIsValid(userId)

      if (!isIdValid) {
        return generateInvalidIdResponse()
      }

      const deletedUser = await this.deleteUserUseCase.execute(userId)

      if (!deletedUser) {
        return userNotFound()
      }

      return ok(deletedUser)
    } catch (error) {
      console.log(error)

      return serverError()
    }
  }
}
