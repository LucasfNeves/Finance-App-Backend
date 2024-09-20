import { faker } from '@faker-js/faker'
import { CreateUserUseCase } from './create-user'
import { EmailAlreadyInUseError } from '../../errors/user'

/* eslint-disable no-undef */
describe('Create User Use Case', () => {
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

  const user = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 7 }),
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
})
