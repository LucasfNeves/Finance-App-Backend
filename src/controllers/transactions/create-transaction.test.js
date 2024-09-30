import { transaction } from '../../tests/index.js'
import { CreateTransactionController } from './create-transaction.js'

/* eslint-disable no-undef */
describe('Create Transaction Controller', () => {
  class CreateTransactionUseCaseStub {
    async execute() {
      return transaction
    }
  }

  const baseHttpRequest = {
    body: {
      ...transaction,
      id: undefined,
    },
  }

  const makeSut = () => {
    const createTransactionUseCase = new CreateTransactionUseCaseStub()
    const sut = new CreateTransactionController(createTransactionUseCase)

    return { sut, createTransactionUseCase }
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

  it('should return 201 when crating transaction sucessfuly (expense)', async () => {
    // arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute(baseHttpRequest)

    //assert
    expect(response.statusCode).toBe(201)
  })

  it('should return 201 when crating transaction sucessfuly (earning)', async () => {
    // arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        type: 'EARNING',
      },
    })

    //assert
    expect(response.statusCode).toBe(201)
  })

  it('should return 201 when crating transaction sucessfuly (investment)', async () => {
    // arrange
    const { sut } = makeSut()

    //act
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        type: 'INVESTMENT',
      },
    })

    //assert
    expect(response.statusCode).toBe(201)
  })

  it('should return 400 when amount is not a valid currency', async () => {
    // arrange
    const { sut } = makeSut()

    // act
    const response = await sut.execute({
      body: {
        ...baseHttpRequest.body,
        amount: 'invalid_amount',
      },
    })

    // assert
    expect(response.statusCode).toBe(400)
  })

  it('should return 500 when CreateTransactionUseCase throws', async () => {
    // arrange
    const { sut, createTransactionUseCase } = makeSut()
    jest
      .spyOn(createTransactionUseCase, 'execute')
      .mockRejectedValueOnce(() => {
        new Error()
      })

    // act
    const response = await sut.execute(baseHttpRequest)

    // assert
    expect(response.statusCode).toBe(500)
  })

  it('should call getUserByIdUserCase with correct params', async () => {
    //arrange
    const { sut, createTransactionUseCase } = makeSut()

    const executeSpy = jest.spyOn(createTransactionUseCase, 'execute')

    //act
    await sut.execute(baseHttpRequest)

    //assert
    expect(executeSpy).toHaveBeenCalledWith(baseHttpRequest.body)
  })
})
