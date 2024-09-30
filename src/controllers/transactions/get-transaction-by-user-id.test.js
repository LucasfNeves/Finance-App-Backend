/* eslint-disable no-undef */

import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id.js'
import { UserNotFoundError } from '../../errors/user.js'
import { transaction } from '../../tests/index.js'

describe('Get Transaction By User ID Controller', () => {
  class GetUserByIdUserCaseStub {
    async execute() {
      return [transaction]
    }
  }

  const makeSut = () => {
    const getUserByIdUserCase = new GetUserByIdUserCaseStub()
    const sut = new GetTransactionsByUserIdController(getUserByIdUserCase)

    return { sut, getUserByIdUserCase }
  }

  test('should return 200 when finding transactions by user id sucessfully', async () => {
    // arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      query: { userId: faker.string.uuid() },
    })

    //assert
    expect(response.statusCode).toBe(200)
  })

  test('should return 400 when missing userId param', async () => {
    // arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      query: { userId: undefined },
    })

    //assert
    expect(response.statusCode).toBe(400)
  })

  test('should return 400 when userId param is invalid', async () => {
    // arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      query: { userId: 'invalid_user_id' },
    })

    //assert
    expect(response.statusCode).toBe(400)
  })

  test('should return 404 when GetUserByIdUseCase throws UserNotFoundError', async () => {
    // arrange
    const { sut, getUserByIdUserCase } = makeSut()

    jest
      .spyOn(getUserByIdUserCase, 'execute')
      .mockRejectedValueOnce(new UserNotFoundError())

    //act
    const response = await sut.execute({
      query: { userId: faker.string.uuid() },
    })

    //assert
    expect(response.statusCode).toBe(404)
  })

  test('should return 500 when GetUserByIdUseCase throws generic error', async () => {
    // arrange
    const { sut, getUserByIdUserCase } = makeSut()

    jest
      .spyOn(getUserByIdUserCase, 'execute')
      .mockRejectedValueOnce(new Error())

    //act
    const response = await sut.execute({
      query: { userId: faker.string.uuid() },
    })

    //assert
    expect(response.statusCode).toBe(500)
  })

  it('should call getUserByIdUserCase with correct params', async () => {
    //arrange
    const { sut, getUserByIdUserCase } = makeSut()

    const executeSpy = jest.spyOn(getUserByIdUserCase, 'execute')

    const userId = faker.string.uuid()

    //act
    await sut.execute({ query: { userId: userId } })

    //assert
    expect(executeSpy).toHaveBeenCalledWith(userId)
  })
})
