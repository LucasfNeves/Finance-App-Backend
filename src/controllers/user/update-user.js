import { ZodError } from 'zod'
import { EmailAlreadyInUseError } from '../../errors/user.js'
import { updateUserSchema } from '../../schemas/user.js'
import {
  baadRequest,
  ok,
  serverError,
  checkIfIdIsValid,
  generateInvalidIdResponse,
} from '../helpers/index.js'

export class UpdateUserController {
  constructor(updateUserUseCase) {
    this.updateUserUseCase = updateUserUseCase
  }
  async execute(httpRequest) {
    try {
      const params = httpRequest.body
      const { userId } = httpRequest.params

      const isIdValid = checkIfIdIsValid(userId)

      if (!isIdValid) {
        return generateInvalidIdResponse()
      }

      await updateUserSchema.parseAsync(params)

      const updtedUser = await this.updateUserUseCase.execute(userId, params)

      return ok(updtedUser)

      // const allowedFields = ['first_name', 'last_name', 'email', 'password']

      // const someFieldIsNotAllowed = Object.keys(params).some(
      //   (field) => !allowedFields.includes(field),
      // )

      // if (someFieldIsNotAllowed) {
      //   return baadRequest({
      //     message: 'Some provide fields is not allowed',
      //   })
      // }

      // if (params.password) {
      //   const passwordIsValid = checkIfPasswordIsValid(params.password)

      //   if (!passwordIsValid) {
      //     return generateInvalidPasswordResponse()
      //   }

      //   if (params.email) {
      //     const emailIsValid = checkIfEmailIsValid(params.email)

      //     if (!emailIsValid) {
      //       return generateEmailAlreadyInUseResponse()
      //     }
      //   }
      // }
    } catch (error) {
      if (error instanceof ZodError) {
        return baadRequest({
          message: error.errors[0].message,
        })
      }

      if (error instanceof EmailAlreadyInUseError) {
        return baadRequest({
          message: error.message,
        })
      }

      console.log(error)
      return serverError()
    }
  }
}
