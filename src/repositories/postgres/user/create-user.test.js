import { prisma } from '../../../../prisma/prisma'
import { user } from '../../../tests/fixtures/user'
import { PostgresCreateUserRepository } from './create-user'

/* eslint-disable no-undef */
describe('CreateUserRepository', () => {
  test('should create a user on db', async () => {
    const sut = new PostgresCreateUserRepository()

    const result = await sut.execute(user)

    expect(result.id).toBe(user.id)
    expect(result.first_name).toBe(user.first_name)
    expect(result.last_name).toBe(user.last_name)
    expect(result.email).toBe(user.email)
    expect(result.password).toBe(user.password)
  })

  it('should PostgresCreateUserRepository call Prisma with correct params', async () => {
    const sut = new PostgresCreateUserRepository()
    const prismaSpy = jest.spyOn(prisma.user, 'create')

    await sut.execute(user)

    expect(prismaSpy).toHaveBeenCalledWith({
      data: user,
    })
  })
})
