import {
  baadRequest,
  created,
  serverError,
  checkIfIdIsValid,
  generateInvalidIdResponse,
} from '../../controllers/helpers/index.js'
import validator from 'validator'

export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase
  }
  async execute(httpRequest) {
    try {
      const params = httpRequest.body

      const requiredFields = ['user_id', 'name', 'date', 'amount', 'type']

      for (const field of requiredFields) {
        if (!params[field] || params[field].toString().trim().length === 0) {
          return baadRequest({ message: `Missing param ${field}` })
        }
      }

      const userIdIsValid = checkIfIdIsValid(params.user_id)

      if (!userIdIsValid) return generateInvalidIdResponse()

      if (params.amount <= 0) {
        return baadRequest({
          message: 'The amount must be greater than 0.',
        })
      }

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

      const type = params.type.trim().toUpperCase()

      const typeValid = ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(type)

      if (!typeValid) {
        return baadRequest({
          message: 'The type must be EARNING, EXPENSE or INVESTMENT',
        })
      }

      const transactionParams = {
        ...params,
        type,
      }

      const transaction =
        await this.createTransactionUseCase.execute(transactionParams)

      return created(transaction)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
