import { faker } from '@faker-js/faker'
import { DeleteTransactionUseCase } from './delete-transaction'

/* eslint-disable no-undef */
describe('DeleteTransactionUseCase', () => {
  const transaction = {
    id: faker.string.uuid(),
    user_id: faker.string.uuid(),
    name: faker.commerce.productName(),
    date: faker.date.anytime().toISOString(),
    type: 'EXPENSE',
    amount: Number(faker.finance.amount()),
  }

  class DeleteTransactionRepositoryStub {
    async execute(transactionId) {
      return {
        ...transaction,
        id: transactionId,
      }
    }
  }

  const makeSut = () => {
    const deleteTransactionRepository = new DeleteTransactionRepositoryStub()

    const sut = new DeleteTransactionUseCase(deleteTransactionRepository)

    return {
      sut,
      deleteTransactionRepository,
    }
  }

  test('should delete transaction sucessfully', async () => {
    // arrange
    const { sut } = makeSut()

    // act
    const response = await sut.execute(transaction.id)

    // assert
    expect(response).toEqual({ ...transaction, id: transaction.id })
  })

  test('should call DeleteTransactionRepository with correct values', async () => {
    // arrange
    const { sut, deleteTransactionRepository } = makeSut()

    const executeSpy = jest.spyOn(deleteTransactionRepository, 'execute')

    // act
    await sut.execute(transaction.id)

    // assert
    expect(executeSpy).toHaveBeenCalledWith(transaction.id)
  })

  test('should throw if DeleteTransactionRepository throws', async () => {
    // arrange
    const { sut, deleteTransactionRepository } = makeSut()

    jest
      .spyOn(deleteTransactionRepository, 'execute')
      .mockRejectedValueOnce(new Error())

    // act
    const promise = sut.execute(transaction.id)

    // assert
    await expect(promise).rejects.toThrow()
  })
})
