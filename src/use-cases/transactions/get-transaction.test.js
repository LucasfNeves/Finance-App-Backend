import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdUseCase } from './get-transactions-by-user-id'

/* eslint-disable no-undef */
describe('GetTransactionUseCase', () => {
  const user = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 7 }),
  }

  class GetTransactionRepositoryStub {
    async execute() {
      return []
    }
  }

  class GetUserByIdRepositoryStub {
    async execute(userId) {
      return { ...user, id: userId }
    }
  }

  const makeSut = () => {
    const getTransactionRepository = new GetTransactionRepositoryStub()
    const getUserByIdRepository = new GetUserByIdRepositoryStub()

    const sut = new GetTransactionsByUserIdUseCase(
      getTransactionRepository,
      getUserByIdRepository,
    )

    return {
      sut,
      getTransactionRepository,
      getUserByIdRepository,
    }
  }

  test('should get transaction sucessfully', async () => {
    // arrange
    const { sut } = makeSut()

    // act
    const response = await sut.execute(user.id)

    // assert
    expect(response).toEqual([])
  })
})
