import { faker } from '@faker-js/faker'
import { UpdateTransactionUseCase } from './update-transaction'

/* eslint-disable no-undef */
describe('UpdateTransactionUseCase', () => {
  const createTransactionParams = {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    name: faker.commerce.productName(),
    date: faker.date.anytime().toISOString(),
    type: 'EXPENSE',
    amount: Number(faker.finance.amount()),
  }

  class UpdateTransactionRepositoryStub {
    async execute(transactionId) {
      return {
        id: transactionId,
        ...createTransactionParams,
      }
    }
  }

  const makeSut = () => {
    const updateTransactionRepository = new UpdateTransactionRepositoryStub()
    const sut = new UpdateTransactionUseCase(updateTransactionRepository)

    return {
      sut,
      updateTransactionRepository,
    }
  }

  test('should update transaction sucessfully', async () => {
    // arrange
    const { sut } = makeSut()

    // act
    const response = await sut.execute(createTransactionParams.id, {
      amount: Number(faker.finance.amount()),
    })

    // assert
    expect(response).toEqual(createTransactionParams)
  })

  test('should call updateTransactionRepository with correct values', async () => {
    // arrange
    const { sut, updateTransactionRepository } = makeSut()
    const updateTransactionRepositorySpy = jest.spyOn(
      updateTransactionRepository,
      'execute',
    )

    // act
    await sut.execute(
      createTransactionParams.id,
      createTransactionParams.amount,
    )

    // assert
    expect(updateTransactionRepositorySpy).toHaveBeenCalledWith(
      createTransactionParams.id,
      createTransactionParams.amount,
    )
  })

  test('should throw if updateTransactionRepository throws', async () => {
    // arrange
    const { sut, updateTransactionRepository } = makeSut()
    jest
      .spyOn(updateTransactionRepository, 'execute')
      .mockRejectedValue(new Error())

    // act
    const promise = sut.execute(
      createTransactionParams.id,
      createTransactionParams.amount,
    )

    // assert
    await expect(promise).rejects.toThrow()
  })
})
