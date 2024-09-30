import { CreateUserUseCase } from './create-user.js'
import { EmailAlreadyInUseError } from '../../errors/user.js'
import { user as fixtureUser } from '../../tests/index.js'

/* eslint-disable no-undef */
describe('Create User Use Case', () => {
  const user = {
    ...fixtureUser,
    id: undefined,
  }
  class GetUSerByEmailRepositoryStub {
    async execute() {
      return null
    }
  }
  class CreateUserRepositoryStub {
    async execute(user) {
      return user
    }
  }

  class PasswordHaserAdapterStub {
    async execute() {
      return 'hashed_password'
    }
  }

  class IdGeneratorAdapterStub {
    execute() {
      return 'generated_id'
    }
  }

  const makeSut = () => {
    const getUserByEmailRepository = new GetUSerByEmailRepositoryStub()
    const createUserRepository = new CreateUserRepositoryStub()
    const passwordHaserAdapter = new PasswordHaserAdapterStub()
    const idGeneratorAdapter = new IdGeneratorAdapterStub()

    const sut = new CreateUserUseCase(
      getUserByEmailRepository,
      createUserRepository,
      passwordHaserAdapter,
      idGeneratorAdapter,
    )

    return {
      sut,
      getUserByEmailRepository,
      createUserRepository,
      passwordHaserAdapter,
      idGeneratorAdapter,
    }
  }

  test('should sucessfully create a user', async () => {
    //arrange
    const { sut } = makeSut()

    //act
    const createdUser = await sut.execute(user)

    expect(createdUser).toBeTruthy()
  })

  test('should throw an error if GetUSerByEmailRepository returns user already exists', async () => {
    //arrange
    const { sut, getUserByEmailRepository } = makeSut()

    jest.spyOn(getUserByEmailRepository, 'execute').mockReturnValueOnce(user)

    //act

    // chamamos o sut sem o await para não aguardar a execução e guardar a promisse na variável
    const promise = sut.execute(user)

    //assert
    await expect(promise).rejects.toThrow(
      new EmailAlreadyInUseError(user.email),
    )
  })

  test('should call idGeneratorAdapter to generate a random id', async () => {
    const { sut, idGeneratorAdapter, createUserRepository } = makeSut()
    const idGenratorSpy = jest.spyOn(idGeneratorAdapter, 'execute')
    const createUserRepositorySpy = jest.spyOn(createUserRepository, 'execute')

    //act
    await sut.execute(user)

    //expect
    expect(idGenratorSpy).toHaveBeenCalled()
    expect(createUserRepositorySpy).toHaveBeenCalledWith({
      ...user,
      password: 'hashed_password',
      id: 'generated_id',
    })
  })

  test('should ', async () => {
    const { sut, createUserRepository, passwordHaserAdapter } = makeSut()
    const passwordHasherSpy = jest.spyOn(passwordHaserAdapter, 'execute')
    const createUserRepositorySpy = jest.spyOn(createUserRepository, 'execute')

    //act
    await sut.execute(user)

    //expect
    expect(passwordHasherSpy).toHaveBeenCalledWith(user.password)
    expect(createUserRepositorySpy).toHaveBeenCalledWith({
      ...user,
      password: 'hashed_password',
      id: 'generated_id',
    })
  })

  it('should throw if GetUserByEmailRepository throws', async () => {
    // arrange
    const { sut, getUserByEmailRepository } = makeSut()
    jest
      .spyOn(getUserByEmailRepository, 'execute')
      .mockRejectedValueOnce(new Error())

    // act
    const promise = sut.execute(user)

    // assert
    expect(promise).rejects.toThrow()
  })

  it('should throw if IdGeneratorAdapter throws', async () => {
    // arrange
    const { sut, idGeneratorAdapter } = makeSut()
    jest.spyOn(idGeneratorAdapter, 'execute').mockImplementationOnce(() => {
      throw new Error()
    })

    // act
    const promise = sut.execute(user)

    // assert
    expect(promise).rejects.toThrow()
  })

  it('should throw if PasswordHaserAdapter throws', async () => {
    // arrange
    const { sut, passwordHaserAdapter } = makeSut()
    jest.spyOn(passwordHaserAdapter, 'execute').mockRejectedValue(new Error())

    // act
    const promise = sut.execute(user)

    // assert
    expect(promise).rejects.toThrow()
  })

  it('should throw if CreateUserRepository throws', async () => {
    // arrange
    const { sut, createUserRepository } = makeSut()
    jest.spyOn(createUserRepository, 'execute').mockRejectedValue(new Error())

    // act
    const promise = sut.execute(user)

    // assert
    expect(promise).rejects.toThrow()
  })
})
