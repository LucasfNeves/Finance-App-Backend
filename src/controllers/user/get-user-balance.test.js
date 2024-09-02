/* eslint-disable no-undef */
import { faker } from '@faker-js/faker'
import { GetUserBalanceController } from './get-user-balance'

describe('GetUserBalanceController', () => {
  class GetUserBalnceUsCaseStub {
    async execute() {
      return faker.number.int()
    }
  }

  const makeSut = () => {
    const getUserBalanceUseCase = new GetUserBalnceUsCaseStub()
    const sut = new GetUserBalanceController(getUserBalanceUseCase)

    return { getUserBalanceUseCase, sut }
  }

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
  }

  it('should return 200 when getting user balance', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const httResponse = await sut.execute(httpRequest)

    //assert
    expect(httResponse.statusCode).toBe(200)
  })
})
