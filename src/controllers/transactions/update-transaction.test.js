/* eslint-disable no-undef */

import { faker } from '@faker-js/faker'
import { UpdateTransactionController } from './update-transaction.js'
import { transaction } from '../../tests/index.js'

describe('Update Transaction Controller', () => {
  class UpdateTransactionUseCaseStub {
    async execute() {
      return transaction
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
        unallowedField: 'unallowed_value',
      },
    })

    //assert
    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when amount is invalid', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      ...baseHttpRequest,
      body: {
        amount: 'invalid_amount',
      },
    })

    //assert
    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when type is invalid', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      ...baseHttpRequest,
      body: {
        type: 'invalid_type',
      },
    })

    //assert
    expect(response.statusCode).toBe(400)
  })

  it('should return 500 when updateTransactionUseCase throws', async () => {
    //arrange
    const { sut, updateTransactionUseCase } = makeSut()

    jest
      .spyOn(updateTransactionUseCase, 'execute')
      .mockRejectedValueOnce(new Error())
    //act
    const response = await sut.execute(baseHttpRequest)

    //assert
    expect(response.statusCode).toBe(500)
  })

  it('should call UpdateTransactionUseCase with correct params', async () => {
    //arrange
    const { sut, updateTransactionUseCase } = makeSut()

    const executeSpy = jest.spyOn(updateTransactionUseCase, 'execute')

    //act
    await sut.execute(baseHttpRequest)

    //assert
    expect(executeSpy).toHaveBeenCalledWith(
      baseHttpRequest.params.transactionId,
      baseHttpRequest.body,
    )
  })
})
