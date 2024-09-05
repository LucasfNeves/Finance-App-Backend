import { ZodError } from 'zod'
import {
  baadRequest,
  created,
  serverError,
} from '../../controllers/helpers/index.js'
import { createtransactionSchema } from '../../schemas/transaction.js'

export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase
  }
  async execute(httpRequest) {
    try {
      const params = httpRequest.body

      await createtransactionSchema.parseAsync(params)

      const transaction = await this.createTransactionUseCase.execute(params)

      return created(transaction)

      // const requiredFields = ['user_id', 'name', 'date', 'amount', 'type']

      // const requiredFieldsValidation = validateRequiredFields(
      //   params,
      //   requiredFields,
      // )

      // if (!requiredFieldsValidation.ok) {
      //   return baadRequest({
      //     message: `The field ${requiredFieldsValidation.missingField} is required`,
      //   })
      // }

      // const userIdIsValid = checkIfIdIsValid(params.user_id)

      // if (!userIdIsValid) return generateInvalidIdResponse()

      // const amountisValid = validator.isCurrency(params.amount.toString(), {
      //   digits_after_decimal: [2],
      //   allow_negatives: false,
      //   decimal_separator: '.',
      // })

      // if (!amountisValid) {
      //   return baadRequest({
      //     message: 'The amount must be a valid curreny',
      //   })
      // }

      // const type = params.type.trim().toUpperCase()

      // const typeValid = ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(type)

      // if (!typeValid) {
      //   return baadRequest({
      //     message: 'The type must be EARNING, EXPENSE or INVESTMENT',
      //   })
      // }

      // const transactionParams = {
      //   ...params,
      //   type,
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
