import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdUseCase } from './get-transactions-by-user-id'
import { UserNotFoundError } from '../../errors/user'

/* eslint-disable no-undef */
describe('GetTransactionUseCase', () => {
  const user = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 7 }),
  }

  class GetTransactionRepositoryStub {
    async execute() {
      return []
    }
  }

  class GetUserByIdRepositoryStub {
    async execute(userId) {
      return { ...user, id: userId }
    }
  }

  const makeSut = () => {
    const getTransactionRepository = new GetTransactionRepositoryStub()
    const getUserByIdRepository = new GetUserByIdRepositoryStub()

    const sut = new GetTransactionsByUserIdUseCase(
      getTransactionRepository,
      getUserByIdRepository,
    )

    return {
      sut,
      getTransactionRepository,
      getUserByIdRepository,
    }
  }

  test('should get transaction sucessfully', async () => {
    // arrange
    const { sut } = makeSut()

    // act
    const response = await sut.execute(user.id)

    // assert
    expect(response).toEqual([])
  })

  test('should throw UserNotFound if user does not exist', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut()
    jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValue(null)

    // act
    const promise = sut.execute(user.id)

    // assert
    await expect(promise).rejects.toThrow(new UserNotFoundError(user.id))
  })

  test('should call GetUserByIdRepository with correct values', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut()
    const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')

    // act
    await sut.execute(user.id)

    // assert
    expect(executeSpy).toHaveBeenCalledWith(user.id)
  })

  test('should call GetTransactionRepository with correct values', async () => {
    // arrange
    const { sut, getTransactionRepository } = makeSut()
    const executeSpy = jest.spyOn(getTransactionRepository, 'execute')

    // act
    await sut.execute(user.id)

    // assert
    expect(executeSpy).toHaveBeenCalled()
  })

  test('should throw if GetUserByIdRepository throws', async () => {
    // arrange
    const { sut, getUserByIdRepository } = makeSut()
    jest
      .spyOn(getUserByIdRepository, 'execute')
      .mockRejectedValueOnce(new Error())

    // act
    const promise = sut.execute(user.id)

    // assert
    await expect(promise).rejects.toThrow()
  })

  test('should throw if GetTransactionRepository throws', async () => {
    // arrange
    const { sut, getTransactionRepository } = makeSut()
    jest
      .spyOn(getTransactionRepository, 'execute')
      .mockRejectedValueOnce(new Error())

    // act
    const promise = sut.execute(user.id)

    // assert
    await expect(promise).rejects.toThrow()
  })
})
