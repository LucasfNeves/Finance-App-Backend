import { EmailAlreadyInUseError } from '../../errors/user.js'

export class UpdateUserUseCase {
  constructor(
    getUserByEmailRepository,
    updateUserRepository,
    passwordHasherAdapter,
  ) {
    this.getUserByEmailRepository = getUserByEmailRepository
    this.updateUserRepository = updateUserRepository
    this.passwordHasherAdapter = passwordHasherAdapter
  }
  async execute(userId, updateUserParams) {
    // Se o email estiver sendo atualizado verificar se ele já está em uso
    if (updateUserParams.email) {
      const userWithProvideEmail = await this.getUserByEmailRepository.execute(
        updateUserParams.email,
      )

      if (userWithProvideEmail && userWithProvideEmail.id !== userId) {
        throw new EmailAlreadyInUseError(updateUserParams.email)
      }
    }

    // Se a senha estiver sendo atualizada criptografa-la

    const user = {
      ...updateUserParams,
    }

    if (updateUserParams.password) {
      const hashedPassword = await this.passwordHasherAdapter.execute(
        updateUserParams.password,
      )

      user.password = hashedPassword
    }

    // Chamar o repository par atualizar o usuário
    const updateUser = await this.updateUserRepository.execute(userId, user)

    return updateUser
  }
}
