import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
  baadRequest,
  ok,
  serverError,
} from './helpers/index.js'

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
        return baadRequest({
          message: 'User not found',
        })
      }

      return ok(user)
    } catch (error) {
      console.log(error)
      return serverError()
    }
  }
}
