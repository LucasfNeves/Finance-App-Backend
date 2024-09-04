import { faker } from '@faker-js/faker'
import { UpdateUserController } from './update-user'

/* eslint-disable no-undef */
describe('UpdateUserController', () => {
  class UpdateUserUseCaseStub {
    async execute(user) {
      return user
    }
  }

  const makeSut = () => {
    const updateUserUseCase = new UpdateUserUseCaseStub()
    const sut = new UpdateUserController(updateUserUseCase)

    return { sut, updateUserUseCase }
  }

  const htppRequest = {
    params: {
      userId: faker.string.uuid(),
    },
    body: {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({
        length: 7,
      }),
    },
  }

  it('should return 200 when updating a user successfully', async () => {
    // arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute(htppRequest)

    //assert
    expect(response.statusCode).toBe(200)
  })

  test('should return 400 when an invalid email is provided', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      params: htppRequest.params,
      body: {
        ...htppRequest.body,
        email: 'invalid_email',
      },
    })

    //assert
    expect(response.statusCode).toBe(400)
  })

  test('should return 400 when an invalid password is provided', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      params: htppRequest.params,
      body: {
        ...htppRequest.body,
        password: faker.internet.password({ length: 5 }),
      },
    })

    //assert
    expect(response.statusCode).toBe(400)
  })

  test('should return 400 when an invalid userId is provided', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      params: {
        userId: 'invalid_id',
      },
      body: {
        ...htppRequest.body,
      },
    })

    //assert
    expect(response.statusCode).toBe(400)
  })

  test('should return 400 when an unallowed field is provided', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      params: htppRequest.params,
      body: {
        ...htppRequest.body,
        unallowed_field: 'unallowed_value',
      },
    })

    //assert
    expect(response.statusCode).toBe(400)
  })

  test('should return 500 if UpdateUserUseCase throws with generic error', async () => {
    //arrange
    const { sut, updateUserUseCase } = makeSut()
    jest.spyOn(updateUserUseCase, 'execute').mockRejectedValueOnce(new Error())

    //act
    const response = await sut.execute(htppRequest)

    //assert
    expect(response.statusCode).toBe(500)
  })
})
