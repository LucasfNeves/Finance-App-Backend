import { DeleteUserUseCase } from '../use-cases/delete-user.js'
import {
  checkIfIdIsValid,
  generateInvalidIdResponse,
  userNotFound,
  ok,
  serverError,
} from './helpers/index.js'

export class DeleteUserController {
  async execute(httpRequest) {
    try {
      const { userId } = httpRequest.params

      const isIdValid = checkIfIdIsValid(userId)

      if (!isIdValid) {
        return generateInvalidIdResponse()
      }

      const deleteUserUseCase = new DeleteUserUseCase()

      const deletedUser = await deleteUserUseCase.execute(userId)

      if (!deletedUser) {
        return userNotFound()
      }

      return ok(deletedUser)
    } catch (error) {
      console.log(error)

      return serverError()
    }
  }
}
