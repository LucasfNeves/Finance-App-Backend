import validator from 'validator'
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import { baadRequest, ok, serverError } from './helpers/http.js'
import { generateInvalidIdResponse } from './helpers/user.js'

export class GetUserByIdController {
  async execute(httpRequest) {
    try {
      const { userId } = httpRequest.params

      const isIdValid = validator.isUUID(userId)

      if (!isIdValid) {
        return generateInvalidIdResponse()
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
