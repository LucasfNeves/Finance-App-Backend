import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import { EmailAlreadyInUseError } from '../../errors/user.js'

export class CreateUserUseCase {
  constructor(getUserByEmailRepository, createUserRepository) {
    this.getUserByEmailRepository = getUserByEmailRepository
    this.createUserRepository = createUserRepository
  }
  async execute(createUserParams) {
    //Verficar se o emil já está em uso

    const userWithProvideEmail = await this.getUserByEmailRepository.execute(
      createUserParams.email,
    )

    if (userWithProvideEmail) {
      throw new EmailAlreadyInUseError(createUserParams.email)
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

    const createdUser = this.createUserRepository.execute(user)

    return createdUser
  }
}
