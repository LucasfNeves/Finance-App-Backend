import { EmailAlreadyInUseError } from '../errors/user.js'
import bcrypt from 'bcrypt'

export class UpdateUserUseCase {
  constructor(getUserByEmailRepository, updateUserRepository) {
    this.getUserByEmailRepository = getUserByEmailRepository
    this.updateUserRepository = updateUserRepository
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
      const hashedPassword = await bcrypt.hash(updateUserParams.password, 10)

      user.password = hashedPassword
    }

    // Chamar o repository par atualizar o usuário
    const updateUser = await this.updateUserRepository.execute(userId, user)

    return updateUser
  }
}
