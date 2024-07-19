import { EmailAlreadyInUseError } from '../errors/user'
import { GetUserByEmailRepository } from '../repositories/postgres/get-user-by-email'
import bcrypt from 'bcrypt'
import { PostgresUpdateUserRepository } from '../repositories/postgres/update-user'

export class UpdteUserUseCase {
  async execute(userId, updateUserParams) {
    // Se o email estiver sendo atualizado verificar se ele já está em uso
    if (updateUserParams.email) {
      const getUserByEmailRepository = new GetUserByEmailRepository()

      const userWithProvideEmail = await getUserByEmailRepository.execute(
        updateUserParams.email,
      )

      if (userWithProvideEmail) {
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
    const postgresUpdateUserRepository = new PostgresUpdateUserRepository()
    const updateUser = await postgresUpdateUserRepository.execute(userId, user)

    return updateUser
  }
}
