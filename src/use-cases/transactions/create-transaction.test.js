import { CreateTransactionUseCase } from './create-transactions.js'
import { UserNotFoundError } from '../../errors/user.js'
import { transaction, user } from '../../tests/index.js'

/* eslint-disable no-undef */
describe('CreateTransactionUseCase', () => {
  const createTransactionParams = {
    ...transaction,
    id: undefined,
  }

  class CreateTransactionRepositoryStub {
    async execute() {
      return transaction
    }
  }

  class IdGeneratorAdapterStub {
    execute() {
      return 'random_id'
    }
  }

  class GetUserByIdRepositoryStub {
    async execute(userId) {
      return { ...user, id: userId }
    }
  }

  const makeSut = () => {
    const createTransactionRepository = new CreateTransactionRepositoryStub()
    const idGeneratorAdapter = new IdGeneratorAdapterStub()
    const getUserByIdRepository = new GetUserByIdRepositoryStub()

    const sut = new CreateTransactionUseCase(
      createTransactionRepository,
      getUserByIdRepository,
      idGeneratorAdapter,
    )

    return {
      sut,
      createTransactionRepository,
      idGeneratorAdapter,
      getUserByIdRepository,
    }
  }

  test('should create transaction sucessfully', async () => {
    // arrange
    const { sut } = makeSut()

    // act
    const result = await sut.execute(createTransactionParams)

    // assert
    expect(result).toEqual(transaction)
  })

  test('should call GetUserByIdRepository with correct values', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut()
    const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')

    // act
    await sut.execute(createTransactionParams)

    // assert
    expect(executeSpy).toHaveBeenCalledWith(createTransactionParams.user_id)
  })

  test('should call IdGeneratorAdpter', async () => {
    // arrange
    const { sut, idGeneratorAdapter } = makeSut()
    const executeSpy = jest.spyOn(idGeneratorAdapter, 'execute')

    // act
    await sut.execute(createTransactionParams)

    // assert
    expect(executeSpy).toHaveBeenCalled()
  })

  test('should call CreateTransactionRepository with correct values', async () => {
    // arrange
    const { sut, createTransactionRepository } = makeSut()
    const executeSpy = jest.spyOn(createTransactionRepository, 'execute')

    // act
    await sut.execute(createTransactionParams)

    // assert
    expect(executeSpy).toHaveBeenCalledWith({
      ...createTransactionParams,
      id: 'random_id',
    })
  })

  test('should throw UserNotFoundError if user does not exist', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut()
    jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)

    // act
    const promise = sut.execute(createTransactionParams)

    // assert
    await expect(promise).rejects.toThrow(
      new UserNotFoundError(createTransactionParams.user_id),
    )
  })

  test('should throw if GetUserByIdRepository throws', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut()
    jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValue(new Error())

    // act
    const promise = sut.execute(createTransactionParams)

    // assert
    await expect(promise).rejects.toThrow()
  })

  test('should throw if IdGeneratorAdapter throws', async () => {
    // arrange
    const { sut, idGeneratorAdapter } = makeSut()
    jest.spyOn(idGeneratorAdapter, 'execute').mockImplementation(() => {
      throw new Error()
    })

    // act
    const promise = sut.execute(createTransactionParams)

    // assert
    await expect(promise).rejects.toThrow()
  })

  test('should throw if CreateTransactionRepository throws', async () => {
    // arrange
    const { sut, createTransactionRepository } = makeSut()
    jest
      .spyOn(createTransactionRepository, 'execute')
      .mockRejectedValueOnce(new Error())

    // act
    const promise = sut.execute(createTransactionParams)

    // assert
    await expect(promise).rejects.toThrow()
  })
})
