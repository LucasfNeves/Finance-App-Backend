import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
  ok,
  serverError,
  userNotFoundResponse,
} from '../helpers/index.js'

export class GetUserByIdController {
  constructor(getUserByIdUseCase) {
    this.getUserByIdUseCase = getUserByIdUseCase
  }
  async execute(httpRequest) {
    try {
      const { userId } = httpRequest.params

      const isIdValid = checkIfIdIsValid(userId)

      if (!isIdValid) {
        return generateInvalidIdResponse()
      }

      const user = await this.getUserByIdUseCase.execute(userId)

      if (!user) {
        return userNotFoundResponse()
      }

      return ok(user)
    } catch (error) {
      console.log(error)
      return serverError()
    }
  }
}
