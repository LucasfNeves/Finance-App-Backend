import { UserNotFoundError } from '../../errors/user'
import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
  ok,
  serverError,
  userNotFoundResponse,
} from '../helpers'

export class GetUserBalanceController {
  constructor(getuserBalanceUseCases) {
    this.getuserBalanceUseCases = getuserBalanceUseCases
  }

  async execute(httpRequest) {
    const { userId } = httpRequest.params

    try {
      const idisValid = checkIfIdIsValid(userId)

      if (!idisValid) {
        return generateInvalidIdResponse()
      }

      const balance = this.getuserBalanceUseCases.execute({ userId })

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
