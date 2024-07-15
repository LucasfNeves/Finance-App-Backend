import validator from 'validator'
import { CreateUserUseCase } from '../use-cases/create-user.js'
import { baadRequest, created, serverError } from './helpers.js'
import { EmailAlreadyInUseError } from '../errors/user.js'

export class CreateUserController {
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

      const passwordIsValid = params.password.length < 6

      if (passwordIsValid) {
        return baadRequest({
          message: 'Password must be at least 6 characters',
        })
      }

      const emailIsValid = validator.isEmail(params.email)

      if (!emailIsValid) {
        return baadRequest({
          message: 'Invalid e-mail, please provide valid one.',
        })
      }

      // Chamar o use-case

      const createUserUseCase = new CreateUserUseCase()

      const createdUser = await createUserUseCase.execute(params)

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
