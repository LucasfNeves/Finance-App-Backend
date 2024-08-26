/* eslint-disable no-undef */

import { CreateUserController } from './create-user'

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
        first_name: 'Lucas',
        last_name: 'Farias',
        email: 'lucas.teste@gmail.com',
        password: '1234567',
      },
    }

    // act (Chama o controller a ser testado)
    const result = await createUserController.execute(htppRequest)

    // assert (Fazer a sua expectativa de resultado)
    expect(result.statusCode).toBe(201)
    expect(result.body).toBe(htppRequest.body)
  })

  it('should return 400 if first_name is not provide', async () => {
    // arrange (Prepara o teste para ser executado)
    const createUserController = new CreateUserController(
      new CreateUserUseCaseStub(),
    )

    const htppRequest = {
      body: {
        last_name: 'Farias',
        email: 'lucas.teste@gmail.com',
        password: '1234567',
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
        first_name: 'Lucas',
        email: 'lucas.teste@gmail.com',
        password: '1234567',
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
        first_name: 'Lucas',
        last_name: 'Farias',
        password: '1234567',
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
        first_name: 'Lucas',
        last_name: 'Farias',
        email: 'luc',
        password: '1234567',
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
        first_name: 'Lucas',
        last_name: 'Farias',
        email: 'lucas.teste@gmail.com',
      },
    }

    // act (Chama o controller a ser testado)
    const result = await createUserController.execute(htppRequest)

    // assert (Fazer a sua expectativa de resultado)
    expect(result.statusCode).toBe(400)
  })
})
