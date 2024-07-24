import { PostgresDeleteUserRepository } from '../repositories/postgres/get-user-by-id.js'

export class DeleteUserUseCase {
  async execute(userId) {
    const postgresDeleteUserRepository = new PostgresDeleteUserRepository()

    const delteUser = await postgresDeleteUserRepository.execute(userId)

    //
    return delteUser
  }
}
