import { faker } from '@faker-js/faker'
import { GetUserByIdController } from './get-user-by-id.js'
import { user } from '../../tests/index.js'

/* eslint-disable no-undef */
describe('GetUserByIdController', () => {
  class GetUserByIdUserCaseStub {
    async execute() {
      return user
    }
  }

  const makeSut = () => {
    const getUserByIdUserCaseStub = new GetUserByIdUserCaseStub()
    const sut = new GetUserByIdController(getUserByIdUserCaseStub)

    return { sut, getUserByIdUserCaseStub }
  }

  it('should return 200 if a user found', async () => {
    // arrange
    const { sut } = makeSut()

    // act
    const result = await sut.execute({
      params: { userId: faker.string.uuid() },
    })

    //assert
    expect(result.statusCode).toBe(200)
  })

  it('should return 404 if a user not found', async () => {
    // arrange
    const { sut } = makeSut()

    // act
    const result = await sut.execute({
      params: { userId: 'invalid_id' },
    })

    //assert
    expect(result.statusCode).toBe(400)
  })

  it('should return 404 if a user not found', async () => {
    // arrange
    const { sut, getUserByIdUserCaseStub } = makeSut()
    jest.spyOn(getUserByIdUserCaseStub, 'execute').mockResolvedValue(null)

    // act
    const result = await sut.execute({
      params: { userId: faker.string.uuid() },
    })

    //assert
    expect(result.statusCode).toBe(404)
  })

  it('should return 500 if GetUserByIdUseCase throws an error', async () => {
    //arrange
    const { sut, getUserByIdUserCaseStub } = makeSut()
    jest
      .spyOn(getUserByIdUserCaseStub, 'execute')
      .mockRejectedValue(new Error())

    //act
    const result = await sut.execute({
      params: { userId: faker.string.uuid() },
    })

    //assert
    expect(result.statusCode).toBe(500)
  })

  it('should call getUserByIdUserCase with correct params', async () => {
    //arrange
    const { sut, getUserByIdUserCaseStub } = makeSut()
    const executeSpy = jest.spyOn(getUserByIdUserCaseStub, 'execute')

    const userId = {
      params: { userId: faker.string.uuid() },
    }

    //act
    await sut.execute(userId)

    //assert
    expect(executeSpy).toHaveBeenCalledWith(userId.params.userId)
  })
})
