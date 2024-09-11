import { EmailAlreadyInUseError } from '../../errors/user.js'

export class CreateUserUseCase {
  constructor(
    getUserByEmailRepository,
    createUserRepository,
    passwordHasherAdapter,
    idGeneratorAdapter,
  ) {
    this.getUserByEmailRepository = getUserByEmailRepository
    this.createUserRepository = createUserRepository
    this.passwordHasherAdapter = passwordHasherAdapter
    this.idGeneratorAdapter = idGeneratorAdapter
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
    const userId = this.idGeneratorAdapter.execute()

    // O 10 é o número de criptografia mais recomendado
    const hashedPassword = await this.passwordHasherAdapter.execute(
      createUserParams.password,
    )

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
