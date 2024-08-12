export class GetUserByIdUseCase {
  constructor(getUserByIdRepósitory) {
    this.getUserByIdRepository = getUserByIdRepósitory
  }
  async execute(userId) {
    const user = await this.getUserByIdRepository.execute(userId)

    //
    return user
  }
}
