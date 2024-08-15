import { UserNotFoundError } from '../../errors/user.js'

export class GetTransactionsByUserIdUseCase {
  constructor(getTransactionsByUserIdRepository, getUserByIdRepository) {
    this.getTransactionsByUserIdRepository = getTransactionsByUserIdRepository
    this.getUserByIdRepository = getUserByIdRepository
  }

  async execute(params) {
    console.log(params.userId)

    const user = await this.getUserByIdRepository.execute(params.userId)

    console.log(params.userId)

    if (!user) {
      throw new UserNotFoundError(params.userId)
    }

    const transaction = this.getTransactionsByUserIdRepository.execute(
      params.userId,
    )

    return transaction
  }
}
