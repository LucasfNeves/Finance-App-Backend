import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import { PostgresCreateUserRepository } from '../repositories/postgres/create-user.js'
import { GetUserByEmailRepository } from '../repositories/postgres/get-user-by-email.js'

export class CreateUserUseCase {
  async execute(createUserParams) {
    //Verficar se o emil já está em uso
    const getUserByEmailRepository = new GetUserByEmailRepository()

    const userWithProvideEmail = await getUserByEmailRepository.execute(
      createUserParams.email,
    )

    if (userWithProvideEmail) {
      throw new Error('The provide e-mail is already in use')
    }

    //gerar id do usuário
    const userId = uuidv4()

    // O 10 é o número de criptografia mais recomendado
    const hashedPassword = await bcrypt.hash(createUserParams.password, 10)

    //inserir usuário no banco de dados
    const user = {
      id: userId,
      password: hashedPassword,
      first_name: createUserParams.first_name,
      last_name: createUserParams.last_name,
      email: createUserParams.email,
    }

    //chamar o repositório
    const postgresCreateUserRepository = new PostgresCreateUserRepository()

    return await postgresCreateUserRepository.execute(user)
  }
}
