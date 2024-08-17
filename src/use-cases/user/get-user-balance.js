import { UserNotFoundError } from '../../errors/user.js'

export class GetUserBalanceUseCases {
  constructor(getUserBalanceController, getUserByIdRepository) {
    this.getUserBalanceController = getUserBalanceController
    this.getUserByIdRepository = getUserByIdRepository
  }

  async execute(params) {
    const user = await this.getUserByIdRepository.execute(params.userId)

    if (!user) {
      throw new UserNotFoundError(params.userId)
    }

    const balance = this.getUserBalanceController.execute(params)

    return balance
  }
}
