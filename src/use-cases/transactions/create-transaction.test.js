import { faker } from '@faker-js/faker'
import { CreateTransactionUseCase } from './create-transactions'
import { UserNotFoundError } from '../../errors/user'

/* eslint-disable no-undef */
describe('CreateTransactionUseCase', () => {
  const createTransactionParams = {
    user_id: faker.string.uuid(),
    name: faker.commerce.productName(),
    date: faker.date.anytime().toISOString(),
    type: 'EXPENSE',
    amount: Number(faker.finance.amount()),
  }

  const user = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 7 }),
  }

  class CreateTransactionRepositoryStub {
    async execute(transaction) {
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
    expect(result).toEqual({ ...createTransactionParams, id: 'random_id' })
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
    jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValue(null)

    // act
    const promise = sut.execute(createTransactionParams)

    // assert
    await expect(promise).rejects.toThrow(
      new UserNotFoundError(createTransactionParams.user_id),
    )
  })
})
