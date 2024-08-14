import { userNotFound } from '../../controllers/helpers'

export class GetTransactionsByUserIdUseCase {
  constructor(getTransactionsByUserIdRepository, getUserByIdRepository) {
    this.getTransactionsByUserIdRepository = getTransactionsByUserIdRepository
    this.getUserByIdRepository = getUserByIdRepository
  }

  async execute(params) {
    const user = await this.getUserByIdRepository.execute(params.userId)

    if (!user) {
      return userNotFound()
    }

    const transaction = this.getTransactionsByUserIdRepository.execute(
      params.userId,
    )

    return transaction
  }
}
