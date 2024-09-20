import { faker } from '@faker-js/faker'
import { CreateUserUseCase } from './create-user'

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
    const createdUser = await sut.execute({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    })

    expect(createdUser).toBeTruthy()
  })
})
