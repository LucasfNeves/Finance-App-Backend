import validator from 'validator'
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import { baadRequest, ok, serverError } from './helpers.js'

export class GetUserByIdController {
  async execute(httpRequest) {
    try {
      const { userId } = httpRequest.params

      const isIdValid = validator.isUUID(userId)

      if (!isIdValid) {
        return {
          statusCode: 404,
          body: {
            message: 'The provided id is not valid',
          },
        }
      }

      const getUserByIdUseCase = new GetUserByIdUseCase()

      const user = await getUserByIdUseCase.execute(userId)

      if (!user) {
        return baadRequest({
          messge: 'User not found',
        })
      }

      return ok(user)
    } catch (error) {
      console.log(error)
      return serverError()
    }
  }
}
