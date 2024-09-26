import { faker } from '@faker-js/faker'
import { GetUserByIdUseCase } from './get-user-by-id'

/* eslint-disable no-undef */
describe('GetUserByIdUseCase', () => {
  const user = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({
      length: 7,
    }),
  }
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
    const result = await sut.execute(faker.string.uuid())

    // expect
    expect(result).toEqual(user)
  })

  test('should call GetUserByIdRepository with correct params', async () => {
    // arrange
    const { sut, getUserByIdUseCaseRepository } = makeSut()
    const userId = faker.string.uuid()
    const executeSpy = jest.spyOn(getUserByIdUseCaseRepository, 'execute')

    // act
    await sut.execute(userId)

    // expect
    expect(executeSpy).toHaveBeenCalledWith(userId)
  })

  test('should call GetUserByIdRepository with correct params', async () => {
    // arrange
    const { sut, getUserByIdUseCaseRepository } = makeSut()
    const userId = faker.string.uuid()
    jest
      .spyOn(getUserByIdUseCaseRepository, 'execute')
      .mockRejectedValue(new Error())

    // act
    const promisse = sut.execute(userId)

    // expect
    expect(promisse).rejects.toThrow()
  })
})
