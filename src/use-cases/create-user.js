import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import { PostgresCreateUserRepository } from '../repositories/postgres/create-user'

export class CreateUserUseCase {
  async execute(createUserParams) {
    //gerar id do usuário
    const userId = uuidv4()

    // O 10 é o número de criptografia mais recomendado
    const hashedPassword = await bcrypt.hash(createUserParams.password, 10)

    //inserir usuário no banco de dados
    const user = {
      id: userId,
      password: hashedPassword,
      first_name: createUserParams.firstName,
      last_name: createUserParams.lastName,
      email: createUserParams.email,
    }

    //chamar o repositório
    const postgresCreateUserRepository = new PostgresCreateUserRepository()

    return await postgresCreateUserRepository.execute(user)
  }
}
