import validator from 'validator'
import { baadRequest, ok, serverError } from '../helpers/http'
import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
} from '../helpers/validation'

export class UpdateTransactionController {
  constructor(updateTransactionUseCase) {
    this.updateTransactionUseCase = updateTransactionUseCase
  }

  async execute(httpRequest) {
    try {
      const userId = httpRequest.query.userId
      const transactionId = httpRequest.params.transactionId

      const idIsValid = checkIfIdIsValid(userId)

      if (!idIsValid) {
        return generateInvalidIdResponse()
      }

      const params = httpRequest.body

      const allowedFields = ['name', 'date', 'amount', 'type']

      const someFieldIsNotAllowed = Object.keys(params).some((field) =>
        allowedFields.includes(field),
      )

      if (!someFieldIsNotAllowed) {
        return baadRequest({
          message: 'Some field is not allowed',
        })
      }

      if (params.amount) {
        const amountisValid = validator.isCurrency(params.amount.toString(), {
          digits_after_decimal: [2],
          allow_negatives: false,
          decimal_separator: '.',
        })

        if (!amountisValid) {
          return baadRequest({
            message: 'The amount must be a valid curreny',
          })
        }
      }

      if (params.type) {
        const type = params.type.trim().toUpperCase()

        const typeValid = ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(type)

        if (!typeValid) {
          return baadRequest({
            message: 'The type must be EARNING, EXPENSE or INVESTMENT',
          })
        }
      }

      const transactionPramas = {
        transactionId,
        params,
      }

      const transactions =
        this.updateTransactionUseCase.execute(transactionPramas)

      return ok(transactions)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
