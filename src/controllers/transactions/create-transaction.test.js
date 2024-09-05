import { CreateTransactionController } from './create-transaction'
import { faker } from '@faker-js/faker'

/* eslint-disable no-undef */
describe('Create Transaction Controller', () => {
  class CreateTransactionUseCaseStub {
    async execute(transaction) {
      return transaction
    }
  }

  const baseHttpRequest = {
    body: {
      user_id: faker.string.uuid(),
      name: faker.commerce.productName(),
      date: faker.date.anytime().toISOString(),
      type: 'EXPENSE',
      amount: Number(faker.finance.amount()),
    },
  }

  const makesut = () => {
    const createTransactionUseCasecre = new CreateTransactionUseCaseStub()
    const sut = new CreateTransactionController(createTransactionUseCasecre)

    return { sut, createTransactionUseCasecre }
  }

  it('should return 201 when crating transaction sucessfuly', async () => {
    // arrange
    const { sut } = makesut()

    //act
    const response = await sut.execute(baseHttpRequest)

    //assert
    expect(response.statusCode).toBe(201)
  })
})
