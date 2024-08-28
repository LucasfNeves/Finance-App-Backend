/* eslint-disable no-undef */

import { CreateUserController } from './create-user'
import { faker } from '@faker-js/faker'

describe('Create User Controller', () => {
  // O stub é uma classe fake, que retorna o que seria a mensagem de sucesso da classe original, para possibilitar que você consiga concluir o teste da classe que é dependente a ela
  class CreateUserUseCaseStub {
    execute(user) {
      return user
    }
  }

  it('should returns 201 when create an user sucessfuly', async () => {
    // arrange (Prepara o teste para ser executado)
    const createUserController = new CreateUserController(
      new CreateUserUseCaseStub(),
    )

    const htppRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 7,
        }),
      },
    }

    // act (Chama o controller a ser testado)
    const result = await createUserController.execute(htppRequest)

    // assert (Fazer a sua expectativa de resultado)
    expect(result.statusCode).toBe(201)
    expect(result.body).toEqual(htppRequest.body)
  })

  it('should return 400 if first_name is not provide', async () => {
    // arrange (Prepara o teste para ser executado)
    const createUserController = new CreateUserController(
      new CreateUserUseCaseStub(),
    )

    const htppRequest = {
      body: {
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 7,
        }),
      },
    }

    // act (Chama o controller a ser testado)
    const result = await createUserController.execute(htppRequest)

    // assert (Fazer a sua expectativa de resultado)
    expect(result.statusCode).toBe(400)
  })

  it('should return 400 if last_name is not provide', async () => {
    // arrange (Prepara o teste para ser executado)
    const createUserController = new CreateUserController(
      new CreateUserUseCaseStub(),
    )

    const htppRequest = {
      body: {
        first_name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 7,
        }),
      },
    }

    // act (Chama o controller a ser testado)
    const result = await createUserController.execute(htppRequest)

    // assert (Fazer a sua expectativa de resultado)
    expect(result.statusCode).toBe(400)
  })

  it('should return 400 if email is not provide', async () => {
    // arrange (Prepara o teste para ser executado)
    const createUserController = new CreateUserController(
      new CreateUserUseCaseStub(),
    )

    const htppRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        password: faker.internet.password({
          length: 7,
        }),
      },
    }

    // act (Chama o controller a ser testado)
    const result = await createUserController.execute(htppRequest)

    // assert (Fazer a sua expectativa de resultado)
    expect(result.statusCode).toBe(400)
  })

  it('sould return 400 if email is not valid', async () => {
    //arrange
    const createUserController = new CreateUserController(
      new CreateUserUseCaseStub(),
    )

    const htppRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: 'luc',
        password: faker.internet.password({
          length: 7,
        }),
      },
    }

    // act
    const result = await createUserController.execute(htppRequest)

    // assert
    expect(result.statusCode).toBe(400)
  })

  it('should return 400 if password is not provide', async () => {
    // arrange (Prepara o teste para ser executado)
    const createUserController = new CreateUserController(
      new CreateUserUseCaseStub(),
    )

    const htppRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
      },
    }

    // act (Chama o controller a ser testado)
    const result = await createUserController.execute(htppRequest)

    // assert (Fazer a sua expectativa de resultado)
    expect(result.statusCode).toBe(400)
  })

  it('sould return 400 if password is lass than 6 characteres', async () => {
    //arrange
    const createUserController = new CreateUserController(
      new CreateUserUseCaseStub(),
    )

    const htppRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 5 }),
      },
    }

    // act
    const result = await createUserController.execute(htppRequest)

    // assert
    expect(result.statusCode).toBe(400)
  })

  // aqui usamos o spy para saber se o método foi chamado com tais parâmetros
  it('should call CreateUserUseCase with correct params', async () => {
    // arrange (Prepara o teste para ser executado)
    const CreateUserUseCase = new CreateUserUseCaseStub()
    const createUserController = new CreateUserController(CreateUserUseCase)

    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 7,
        }),
      },
    }

    //você consegue monitorar certo método de certo objeto
    const executeSpy = jest.spyOn(CreateUserUseCase, 'execute')

    // act (Chama o controller a ser testado)
    await createUserController.execute(httpRequest)

    // assert (Fazer a sua expectativa de resultado)
    expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 500 if CreateUserUseCase throws', async () => {
    // arrange (Prepara o teste para ser executado)

    const createUserUseCase = new CreateUserUseCaseStub()
    const createUserController = new CreateUserController(createUserUseCase)

    const htppRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 7,
        }),
      },
    }

    jest.spyOn(createUserUseCase, 'execute').mockImplementationOnce(() => {
      throw new Error()
    })

    //act
    const result = await createUserController.execute(htppRequest)

    // assert
    expect(result.statusCode).toBe(500)
  })
})
