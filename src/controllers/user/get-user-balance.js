import { UserNotFoundError } from '../../errors/user.js'
import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
  ok,
  serverError,
  userNotFoundResponse,
} from '../helpers/index.js'

export class GetUserBalanceController {
  constructor(getuserBalanceUseCase) {
    this.getuserBalanceUseCase = getuserBalanceUseCase
  }

  async execute(httpRequest) {
    const { userId } = httpRequest.params

    try {
      const idisValid = checkIfIdIsValid(userId)

      if (!idisValid) {
        return generateInvalidIdResponse()
      }

      console.log(userId)

      const balance = await this.getuserBalanceUseCase.execute(userId)
      return ok(balance)
    } catch (error) {
      console.error(error)

      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse()
      }

      return serverError()
    }
  }
}
