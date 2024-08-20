import { ZodError } from 'zod'
import { createtransactionSchema } from '../../schemas/transaction.js'
import { baadRequest, ok, serverError } from '../helpers/index.js'

export class UpdateTransactionController {
  constructor(updateTransactionUseCase) {
    this.updateTransactionUseCase = updateTransactionUseCase
  }

  async execute(httpRequest) {
    try {
      const params = httpRequest.body

      await createtransactionSchema.parseAsync(params)

      const transactions = await this.updateTransactionUseCase.execute(params)

      return ok(transactions)

      // const idIsValid = checkIfIdIsValid(httpRequest.params.transactionId)

      // if (!idIsValid) {
      //   return generateInvalidIdResponse()
      // }

      // const allowedFields = ['name', 'date', 'amount', 'type']

      // const someFieldIsNotAllowed = Object.keys(params).some(
      //   (field) => !allowedFields.includes(field),
      // )

      // if (someFieldIsNotAllowed) {
      //   return baadRequest({
      //     message: 'Some field is not allowed',
      //   })
      // }

      // if (params.amount) {
      //   const amountisValid = validator.isCurrency(params.amount.toString(), {
      //     digits_after_decimal: [2],
      //     allow_negatives: false,
      //     decimal_separator: '.',
      //   })

      //   if (!amountisValid) {
      //     return baadRequest({
      //       message: 'The amount must be a valid curreny',
      //     })
      //   }
      // }

      // if (params.type) {
      //   const type = params.type.trim().toUpperCase()

      //   const typeValid = ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(type)

      //   if (!typeValid) {
      //     return baadRequest({
      //       message: 'The type must be EARNING, EXPENSE or INVESTMENT',
      //     })
      //   }
      // }
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
