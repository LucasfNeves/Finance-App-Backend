import { faker } from '@faker-js/faker'
import { UpdateUserUseCase } from './update-user'
import { EmailAlreadyInUseError } from '../../errors/user'

/* eslint-disable no-undef */
describe('UpdateUserUseCase', () => {
  const user = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({
      length: 7,
    }),
  }

  class GetUserByEmailRepositoryStub {
    async execute() {
      return null
    }
  }

  class PasswordHasherAdapterStub {
    async execute() {
      return 'hashed_password'
    }
  }

  class UpdateUserRepositoryStub {
    async execute() {
      return user
    }
  }

  const makeSut = () => {
    const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
    const updateUserRepository = new UpdateUserRepositoryStub()
    const passwordHasherAdapter = new PasswordHasherAdapterStub()
    const sut = new UpdateUserUseCase(
      getUserByEmailRepository,
      updateUserRepository,
      passwordHasherAdapter,
    )

    return {
      sut,
      getUserByEmailRepository,
      updateUserRepository,
      passwordHasherAdapter,
    }
  }

  test('should update user sucessfully without email and password', async () => {
    // arrange
    const { sut } = makeSut()

    // act
    const result = await sut.execute(faker.string.uuid(), {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
    })

    // assert
    expect(result).toBe(user)
  })

  test('should update user sucessfully (with email)', async () => {
    // arrange
    const { sut, getUserByEmailRepository } = makeSut()
    const getUserByEmailRespositorySpy = jest.spyOn(
      getUserByEmailRepository,
      'execute',
    )
    const email = faker.internet.email()

    // act
    const result = await sut.execute(faker.string.uuid(), {
      email: email,
    })

    // assert
    expect(getUserByEmailRespositorySpy).toHaveBeenCalledWith(email)
    expect(result).toBe(user)
  })

  test('should update user sucessfully (with password)', async () => {
    // arrange
    const { sut, passwordHasherAdapter } = makeSut()
    const passwordHasherAdapterSpy = jest.spyOn(
      passwordHasherAdapter,
      'execute',
    )
    const password = faker.internet.password()

    // act
    const result = await sut.execute(faker.string.uuid(), {
      password: password,
    })

    // assert
    expect(passwordHasherAdapterSpy).toHaveBeenCalledWith(password)
    expect(result).toBe(user)
  })

  test('should throw EmailAlreadyInUseError if email is already in use', async () => {
    //arrange

    const { sut, getUserByEmailRepository } = makeSut()
    jest.spyOn(getUserByEmailRepository, 'execute').mockResolvedValue(user)

    // act
    const promisse = sut.execute(faker.string.uuid(), {
      email: user.email,
    })

    // assert
    await expect(promisse).rejects.toThrow(
      new EmailAlreadyInUseError(user.email),
    )
  })

  test('sould ', async () => {
    //arrange
    const { sut, updateUserRepository } = makeSut()
    const updateUserRespositorySpy = jest.spyOn(updateUserRepository, 'execute')

    // act
    await sut.execute(user.id, {
      user,
    })

    // assert
    expect(updateUserRespositorySpy).toHaveBeenCalledWith(user.id, { user })
  })
})
