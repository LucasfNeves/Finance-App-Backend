import { transaction } from '../../tests/index.js'
import { DeleteTransactionController } from './delete-transaction.js'
import { faker } from '@faker-js/faker'

/* eslint-disable no-undef */
describe('Delete Transaction Controller', () => {
  class DeleteTransactionUseCaseStub {
    async execute() {
      return transaction
    }
  }

  const makeSut = () => {
    const deleteTransactionUseCase = new DeleteTransactionUseCaseStub()
    const sut = new DeleteTransactionController(deleteTransactionUseCase)

    return { sut, deleteTransactionUseCase }
  }

  it('should return 200 when deleting a transaction sucessfully', async () => {
    // arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      params: { transactionId: faker.string.uuid() },
    })

    //assert
    expect(response.statusCode).toBe(200)
  })

  it('should return 400 when id is invalid', async () => {
    // arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      params: { transactionId: 'invalid_id' },
    })

    //assert
    expect(response.statusCode).toBe(400)
  })

  it('should return 404 if when transaction not found', async () => {
    // arrange
    const { sut, deleteTransactionUseCase } = makeSut()

    jest.spyOn(deleteTransactionUseCase, 'execute').mockResolvedValueOnce(null)

    //act
    const response = await sut.execute({
      params: { transactionId: faker.string.uuid() },
    })

    //assert
    expect(response.statusCode).toBe(404)
  })

  it('should return 500 when DeleteTransactionUseCase throws', async () => {
    // arrange
    const { sut, deleteTransactionUseCase } = makeSut()

    jest
      .spyOn(deleteTransactionUseCase, 'execute')
      .mockRejectedValueOnce(new Error())

    //act
    const response = await sut.execute({
      params: { transactionId: faker.string.uuid() },
    })

    //assert
    expect(response.statusCode).toBe(500)
  })

  it('should call deleteTransactionUseCase with correct params', async () => {
    //arrange
    const { sut, deleteTransactionUseCase } = makeSut()

    const executeSpy = jest.spyOn(deleteTransactionUseCase, 'execute')

    const transactionId = faker.string.uuid()

    //act
    await sut.execute({ params: { transactionId: transactionId } })

    //assert
    expect(executeSpy).toHaveBeenCalledWith(transactionId)
  })
})
