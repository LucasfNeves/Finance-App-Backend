import { faker } from '@faker-js/faker'
import { UpdateUserController } from './update-user.js'
import { EmailAlreadyInUseError } from '../../errors/user.js'
import { user } from '../../tests/index.js'

/* eslint-disable no-undef */
describe('UpdateUserController', () => {
  class UpdateUserUseCaseStub {
    async execute() {
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

  test('should return 400 if UpdateUserUseCase throws EmailAlreadyInUseError', async () => {
    //arrange
    const { sut, updateUserUseCase } = makeSut()
    jest
      .spyOn(updateUserUseCase, 'execute')
      .mockRejectedValueOnce(new EmailAlreadyInUseError(faker.internet.email()))

    //act
    const response = await sut.execute(htppRequest)

    //assert
    expect(response.statusCode).toBe(400)
  })

  it('should call updateUserUseCase with correct params', async () => {
    //arrange
    const { sut, updateUserUseCase } = makeSut()
    const executeSpy = jest.spyOn(updateUserUseCase, 'execute')

    //act
    await sut.execute(htppRequest)

    //assert
    expect(executeSpy).toHaveBeenCalledWith(
      htppRequest.params.userId,
      htppRequest.body,
    )
  })
})
