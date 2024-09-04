import { faker } from '@faker-js/faker'
import { GetUserByIdController } from './get-user-by-id'

/* eslint-disable no-undef */
describe('GetUserByIdController', () => {
  class GetUserByIdUserCaseStub {
    async execute() {
      return {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 7,
        }),
      }
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
})
