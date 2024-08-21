import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
  notFoundError,
  ok,
  serverError,
} from '../helpers/index.js'

export class DeleteTransactionController {
  constructor(deleteTransactionUseCase) {
    this.deleteTransactionUseCase = deleteTransactionUseCase
  }

  async execute(httpRequest) {
    try {
      const { transactionId } = httpRequest.params

      const isIdValid = checkIfIdIsValid(transactionId)

      if (!isIdValid) {
        return generateInvalidIdResponse()
      }

      const deleteTransaction =
        await this.deleteTransactionUseCase.execute(transactionId)

      if (!deleteTransaction) {
        return notFoundError({
          errorMessage: 'Transaction not found',
        })
      }

      return ok(deleteTransaction)
    } catch (error) {
      console.error(error)

      if (error.code === 'P2025') {
        return notFoundError({
          errorMessage: 'Transaction not found',
        })
      }

      return serverError()
    }
  }
}
