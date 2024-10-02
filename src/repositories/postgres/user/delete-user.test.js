import { prisma } from '../../../../prisma/prisma'
import { user } from '../../../tests/fixtures/user'
import { PostgresDeleteUserRepository } from './delete-user'

/* eslint-disable no-undef */
describe('PostgresDeleteUserRepository', () => {
  test('should PostgresDeleteUserRepository delete a user on db', async () => {
    await prisma.user.create({
      data: user,
    })

    const sut = new PostgresDeleteUserRepository()

    await sut.execute(user.id)

    // Verifica se o usuário foi realmente deletado
    const deletedUser = await prisma.user.findUnique({
      where: { id: user.id },
    })

    // Espera que o usuário seja null após a exclusão
    expect(deletedUser).toBeNull()
  })
})
