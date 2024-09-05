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

  const makeSut = () => {
    const createTransactionUseCasecre = new CreateTransactionUseCaseStub()
    const sut = new CreateTransactionController(createTransactionUseCasecre)

    return { sut, createTransactionUseCasecre }
  }

  it('should return 201 when crating transaction sucessfuly', async () => {
    // arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute(baseHttpRequest)

    //assert
    expect(response.statusCode).toBe(201)
  })

  it('should return 400 when missing user_id', async () => {
    // arrange
    const { sut } = makeSut()

    // act
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        user_id: undefined,
      },
    })

    // assert
    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when missing name', async () => {
    // arrange
    const { sut } = makeSut()

    // act
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        name: undefined,
      },
    })

    // assert
    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when missing date', async () => {
    // arrange
    const { sut } = makeSut()

    // act
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        date: undefined,
      },
    })

    // assert
    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when missing type', async () => {
    // arrange
    const { sut } = makeSut()

    // act
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        type: undefined,
      },
    })

    // assert
    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when missing amount', async () => {
    // arrange
    const { sut } = makeSut()

    // act
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        amount: undefined,
      },
    })

    // assert
    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when is date invalid', async () => {
    // arrange
    const { sut } = makeSut()

    // act
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        date: 'invalid_date',
      },
    })

    // assert
    expect(response.statusCode).toBe(400)
  })

  it('should return 400 when type is invalid', async () => {
    // arrange
    const { sut } = makeSut()

    // act
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        type: 'invalid_type',
      },
    })

    // assert
    expect(response.statusCode).toBe(400)
  })
})
