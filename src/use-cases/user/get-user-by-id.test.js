import { GetUserByIdUseCase } from './get-user-by-id.js'
import { user } from '../../tests/index.js'

/* eslint-disable no-undef */
describe('GetUserByIdUseCase', () => {
  class GetUserByIdRepositoryStub {
    async execute() {
      return user
    }
  }
  const makeSut = () => {
    const getUserByIdUseCaseRepository = new GetUserByIdRepositoryStub()
    const sut = new GetUserByIdUseCase(getUserByIdUseCaseRepository)

    return {
      sut,
      getUserByIdUseCaseRepository,
    }
  }

  test('should get user by id sucessfully', async () => {
    // arrange
    const { sut } = makeSut()

    // act
    const result = await sut.execute(user.id)

    // expect
    expect(result).toEqual(user)
  })

  test('should call GetUserByIdRepository with correct params', async () => {
    // arrange
    const { sut, getUserByIdUseCaseRepository } = makeSut()
    const executeSpy = jest.spyOn(getUserByIdUseCaseRepository, 'execute')

    // act
    await sut.execute(user.id)

    // expect
    expect(executeSpy).toHaveBeenCalledWith(user.id)
  })

  test('should call GetUserByIdRepository with correct params', async () => {
    // arrange
    const { sut, getUserByIdUseCaseRepository } = makeSut()
    jest
      .spyOn(getUserByIdUseCaseRepository, 'execute')
      .mockRejectedValue(new Error())

    // act
    const promisse = sut.execute(user.id)

    // expect
    expect(promisse).rejects.toThrow()
  })
})
