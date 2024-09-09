/* eslint-disable no-undef */

import { faker } from '@faker-js/faker'
import { UpdateTransactionController } from './update-transaction'

describe('Update Transaction Controller', () => {
  class UpdateTransactionUseCaseStub {
    async execute() {
      return {
        user_id: faker.string.uuid(),
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        type: 'EXPENSE',
        amount: Number(faker.finance.amount()),
      }
    }
  }

  const makeSut = () => {
    const updateTransactionUseCase = new UpdateTransactionUseCaseStub()
    const sut = new UpdateTransactionController(updateTransactionUseCase)

    return { sut, updateTransactionUseCase }
  }

  const baseHttpRequest = {
    params: { transactionId: faker.string.uuid() },
    body: {
      name: faker.commerce.productName(),
      date: faker.date.anytime().toISOString(),
      type: 'EXPENSE',
      amount: Number(faker.finance.amount()),
    },
  }

  it('should return 200 when updating a transaction sucessfully', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute(baseHttpRequest)

    //assert
    expect(response.statusCode).toBe(200)
  })

  it('should return 400 when transaction id is invalid', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      params: { transactionId: 'invalid_Id' },
    })

    //assert
    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when unallowed field is provided', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      ...baseHttpRequest,
      body: {
        unallowedField: 'value',
      },
    })

    //assert
    expect(response.statusCode).toBe(400)
  })
})
