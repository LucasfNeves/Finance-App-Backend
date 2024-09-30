import { GetUserBalanceUseCase } from './get-user-balance.js'
import { UserNotFoundError } from '../../errors/user.js'
import { user, userBalance } from '../../tests/index.js'

/* eslint-disable no-undef */
describe('GetUserBalanceUseCase', () => {
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
    const result = await sut.execute(user.id)

    //assert
    expect(result).toEqual(userBalance)
  })

  test('should throw UsernotFoundError if GetUserByIdRepository returns null ', async () => {
    //arrange
    const { sut, getUserByIdRepository } = makeSut()

    jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValue(null)

    //act
    const promisse = sut.execute(user.id)

    //assert
    await expect(promisse).rejects.toThrow(new UserNotFoundError(user.id))
  })

  test('should call GetUserByIdRepository with correct params ', async () => {
    //arrange
    const { sut, getUserByIdRepository } = makeSut()
    const getUserRepositorySpy = jest.spyOn(getUserByIdRepository, 'execute')

    //act
    await sut.execute(user.id)

    //assert
    expect(getUserRepositorySpy).toHaveBeenCalledWith(user.id)
  })

  test('should call GetUserBalanceRepository with correct params ', async () => {
    //arrange
    const { sut, getUserBalanceRepository } = makeSut()
    const getUserBalanceRepositorySpy = jest.spyOn(
      getUserBalanceRepository,
      'execute',
    )

    //act
    await sut.execute(user.id)

    //assert
    expect(getUserBalanceRepositorySpy).toHaveBeenCalledWith(user.id)
  })

  test('should throw if GetUserByIdRepository throws ', async () => {
    //arrange
    const { sut, getUserByIdRepository } = makeSut()
    jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValue(new Error())

    //act
    const promise = sut.execute(user.id)

    //assert
    await expect(promise).rejects.toThrow()
  })

  test('should throw if GetUserBalanceRepository throws ', async () => {
    //arrange
    const { sut, getUserBalanceRepository } = makeSut()
    jest
      .spyOn(getUserBalanceRepository, 'execute')
      .mockRejectedValue(new Error())

    //act
    const promise = sut.execute(user.id)

    //assert
    await expect(promise).rejects.toThrow()
  })
})
