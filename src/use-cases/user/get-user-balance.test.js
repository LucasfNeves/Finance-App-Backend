import { faker } from '@faker-js/faker'
import { GetUserBalanceUseCase } from './get-user-balance'
import { UserNotFoundError } from '../../errors/user'

/* eslint-disable no-undef */
describe('GetUserBalanceUseCase', () => {
  const user = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({
      length: 7,
    }),
  }

  const userBalance = {
    earnings: faker.finance.amount(),
    expenses: faker.finance.amount(),
    investments: faker.finance.amount(),
    balance: faker.finance.amount(),
  }

  class GetUserBalanceRepositoryStub {
    async execute() {
      return userBalance
    }
  }

  class GetUserByIdRepositoryStub {
    async execute() {
      return user
    }
  }

  const makeSut = () => {
    const getUserBalanceRepository = new GetUserBalanceRepositoryStub()
    const getUserByIdRepository = new GetUserByIdRepositoryStub()
    const sut = new GetUserBalanceUseCase(
      getUserBalanceRepository,
      getUserByIdRepository,
    )

    return {
      sut,
      getUserBalanceRepository,
      getUserByIdRepository,
    }
  }

  test('should get user balance sucessfully', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const result = await sut.execute(faker.string.uuid())

    //assert
    expect(result).toEqual(userBalance)
  })

  test('should throw UsernotFoundError if GetUserByIdRepository returns null ', async () => {
    //arrange
    const { sut, getUserByIdRepository } = makeSut()

    jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValue(null)
    const userId = faker.string.uuid()

    //act
    const promisse = sut.execute(userId)

    //assert
    await expect(promisse).rejects.toThrow(new UserNotFoundError(userId))
  })

  test('should call GetUserByIdRepository with correct params ', async () => {
    //arrange
    const { sut, getUserByIdRepository } = makeSut()
    const userId = faker.string.uuid()
    const getUserRepositorySpy = jest.spyOn(getUserByIdRepository, 'execute')

    //act
    await sut.execute(userId)

    //assert
    expect(getUserRepositorySpy).toHaveBeenCalledWith(userId)
  })

  test('should call GetUserBalanceRepository with correct params ', async () => {
    //arrange
    const { sut, getUserBalanceRepository } = makeSut()
    const userId = faker.string.uuid()
    const getUserBalanceRepositorySpy = jest.spyOn(
      getUserBalanceRepository,
      'execute',
    )

    //act
    await sut.execute(userId)

    //assert
    expect(getUserBalanceRepositorySpy).toHaveBeenCalledWith(userId)
  })

  test('should throw if GetUserByIdRepository throws ', async () => {
    //arrange
    const { sut, getUserByIdRepository } = makeSut()
    jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValue(new Error())

    //act
    const promise = sut.execute(faker.string.uuid())

    //assert
    await expect(promise).rejects.toThrow()
  })
})
