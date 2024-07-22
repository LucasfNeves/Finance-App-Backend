import validator from 'validator'
import { baadRequest, ok, serverError } from './helpers.js'
import { UpdateUserUseCase } from '../use-cases/update-user.js'
import { EmailAlreadyInUseError } from '../errors/user.js'

export class UpdateUserController {
  async execute(httpRequest) {
    try {
      const updateUserParams = httpRequest.body
      const { userId } = httpRequest.params

      const isIdValid = validator.isUUID(httpRequest.params.userId)

      if (!isIdValid) {
        return baadRequest({
          message: 'The provided ID is not valid',
        })
      }

      const allowedFields = ['first_name', 'last_name', 'email', 'password']

      const someFieldIsNotAllowed = Object.keys(updateUserParams).some(
        (field) => !allowedFields.includes(field),
      )

      if (someFieldIsNotAllowed) {
        return baadRequest({
          message: 'Some provide fields is not allowed',
        })
      }

      if (updateUserParams.password) {
        const passwordIsValid = updateUserParams.password.length < 6

        if (passwordIsValid) {
          return baadRequest({
            message: 'Password must be at least 6 characters',
          })
        }

        if (updateUserParams.email) {
          const emailIsValid = validator.isEmail(updateUserParams.email)

          if (!emailIsValid) {
            return baadRequest({
              message: 'Invalid e-mail, please provide valid one.',
            })
          }
        }
      }

      const updateUserUseCase = new UpdateUserUseCase()

      const updtedUser = await updateUserUseCase.execute(
        userId,
        updateUserParams,
      )

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
