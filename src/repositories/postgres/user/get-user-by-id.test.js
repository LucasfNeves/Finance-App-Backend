import { prisma } from '../../../../prisma/prisma'
import { PostgresGetUserByIdRepository } from './get-user-by-id'
import { user as fakeUser } from '../../../tests/fixtures/user'

/* eslint-disable no-undef */
describe('PostgresGetUserByIdRepository', () => {
  test('should get user by id on db', async () => {
    // Arrange
    const user = await prisma.user.create({ data: fakeUser })
    const sut = new PostgresGetUserByIdRepository()

    // Act
    const result = await sut.execute(user.id)

    // Assert
    expect(result).toStrictEqual(user)
  })

  test('should call Prisma with correct params', async () => {
    // Arrange
    const sut = new PostgresGetUserByIdRepository()

    const prismaSpy = jest.spyOn(prisma.user, 'findUnique')

    // Act
    await sut.execute(fakeUser.id)

    // Assert
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        id: fakeUser.id,
      },
    })
  })
})
