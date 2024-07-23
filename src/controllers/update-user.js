import { UpdateUserUseCase } from '../use-cases/update-user.js'
import { EmailAlreadyInUseError } from '../errors/user.js'
import {
  baadRequest,
  ok,
  serverError,
  checkIfEmailIsValid,
  checkIfIdIsValid,
  checkIfPasswordIsValid,
  generateEmailAlreadyInUseResponse,
  generateInvalidIdResponse,
  generateInvalidPasswordResponse,
} from './helpers/index.js'

export class UpdateUserController {
  async execute(httpRequest) {
    try {
      const params = httpRequest.body
      const { userId } = httpRequest.params

      const isIdValid = checkIfIdIsValid(userId)

      if (!isIdValid) {
        return generateInvalidIdResponse()
      }

      const allowedFields = ['first_name', 'last_name', 'email', 'password']

      const someFieldIsNotAllowed = Object.keys(params).some(
        (field) => !allowedFields.includes(field),
      )

      if (someFieldIsNotAllowed) {
        return baadRequest({
          message: 'Some provide fields is not allowed',
        })
      }

      if (params.password) {
        const passwordIsValid = checkIfPasswordIsValid(params.password)

        if (!passwordIsValid) {
          return generateInvalidPasswordResponse()
        }

        if (params.email) {
          const emailIsValid = checkIfEmailIsValid(params.email)

          if (!emailIsValid) {
            return generateEmailAlreadyInUseResponse()
          }
        }
      }

      const updateUserUseCase = new UpdateUserUseCase()

      const updtedUser = await updateUserUseCase.execute(userId, params)

      return ok(updtedUser)
    } catch (error) {
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
