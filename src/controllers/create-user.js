import { EmailAlreadyInUseError } from '../errors/user.js'
import {
  baadRequest,
  created,
  serverError,
  checkIfEmailIsValid,
  checkIfPasswordIsValid,
  generateEmailAlreadyInUseResponse,
  generateInvalidPasswordResponse,
} from './helpers/index.js'

export class CreateUserController {
  constructor(createUserUseCase) {
    this.createUserUseCase = createUserUseCase
  }
  async execute(htppRequest) {
    try {
      const params = htppRequest.body
      // validar a requisição (campos obrigatórios, tamanho de senha e e-mail)
      const requiredFields = ['first_name', 'last_name', 'email', 'password']

      for (const field of requiredFields) {
        if (!params[field] || params[field].trim().length === 0) {
          return baadRequest({ message: `Missing param: ${field}` })
        }
      }

      const passwordIsValid = checkIfPasswordIsValid(params.password)

      if (!passwordIsValid) {
        return generateInvalidPasswordResponse()
      }

      const emailIsValid = checkIfEmailIsValid(params.email)

      if (!emailIsValid) {
        return generateEmailAlreadyInUseResponse()
      }

      // Chamar o use-case

      const createdUser = await this.createUserUseCase.execute(params)

      // retornar o status code para o usuário

      return created(createdUser)
    } catch (error) {
      if (error instanceof EmailAlreadyInUseError) {
        return baadRequest({ message: error.message })
      }

      console.error(error)

      return serverError()
    }
  }
}
