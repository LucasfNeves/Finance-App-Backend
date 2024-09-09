/* eslint-disable no-undef */

import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id'

describe('Get Transaction By User ID Controller', () => {
  class GetUserByIdUserCaseStub {
    async execute() {
      return [
        {
          user_id: faker.string.uuid(),
          id: faker.string.uuid(),
          name: faker.commerce.productName(),
          date: faker.date.anytime().toISOString(),
          type: 'EXPENSE',
          amount: Number(faker.finance.amount()),
        },
      ]
    }
  }

  const makeSut = () => {
    const getUserByIdUserCase = new GetUserByIdUserCaseStub()
    const sut = new GetTransactionsByUserIdController(getUserByIdUserCase)

    return { sut, getUserByIdUserCase }
  }

  test('should return 200 when finding transactions by user id sucessfully', async () => {
    // arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      query: { userId: faker.string.uuid() },
    })

    //assert
    expect(response.statusCode).toBe(200)
  })
})
