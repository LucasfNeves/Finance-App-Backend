import { ZodError } from 'zod'
import {
  baadRequest,
  checkIfIdIsValid,
  generateInvalidIdResponse,
  ok,
  serverError,
} from '../helpers/index.js'
import validator from 'validator'

export class UpdateTransactionController {
  constructor(updateTransactionUseCase) {
    this.updateTransactionUseCase = updateTransactionUseCase
  }

  async execute(httpRequest) {
    try {
      const params = httpRequest.body

      const idIsValid = checkIfIdIsValid(httpRequest.params.transactionId)

      if (!idIsValid) {
        return generateInvalidIdResponse()
      }

      const allowedFields = ['name', 'date', 'amount', 'type']

      const someFieldIsNotAllowed = Object.keys(params).some(
        (field) => !allowedFields.includes(field),
      )

      if (someFieldIsNotAllowed) {
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

      const updateTransaction = await this.updateTransactionUseCase.execute(
        httpRequest.params.transactionId,
        params,
      )

      return ok(updateTransaction)
    } catch (error) {
      if (error instanceof ZodError) {
        return baadRequest({
          message: error.errors[0].message,
        })
      }
      console.error(error)
      return serverError()
    }
  }
}
