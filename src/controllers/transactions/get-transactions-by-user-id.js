import { UserNotFoundError } from '../../errors/user'
import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
  ok,
  requiredFieldsMissingResponse,
  serverError,
  userNotFound,
} from '../helpers'

export class GetTransactionsByUserIdController {
  constructor(getTransactionsByUserIdUseCases) {
    this.getTransactionsByUserIdUseCases = getTransactionsByUserIdUseCases
  }

  async execute(httpRequest) {
    try {
      const userId = httpRequest.query.userId

      if (!userId) {
        return requiredFieldsMissingResponse('userId')
      }

      const useridIsValid = checkIfIdIsValid(userId)

      if (!useridIsValid) {
        return generateInvalidIdResponse()
      }

      const transactions =
        await this.getTransactionsByUserIdUseCases.execute(userId)

      return ok(transactions)
    } catch (error) {
      console.error(error)

      if (error instanceof UserNotFoundError) {
        return userNotFound()
      }

      return serverError()
    }
  }
}
