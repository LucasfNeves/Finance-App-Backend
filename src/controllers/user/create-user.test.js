/* eslint-disable no-undef */

import { CreateUserController } from './create-user'

describe('Create User Controller', () => {
  // O stub é uma classe fake, que retorna o que seria a mensagem de sucesso da classe original, para possibilitar que você consiga concluir o teste da classe que é dependente a ela
  class CreateUserUseCaseStub {
    execute(user) {
      return user
    }
  }

  it('should create an user', async () => {
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
    expect(result.body).not.toBeUndefined()
    expect(result.body).not.toBeNull()
    expect(result.body).toBe(htppRequest.body)
  })
})
