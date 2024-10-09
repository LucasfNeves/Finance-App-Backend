import { prisma } from '../../../../prisma/prisma'
import { user as fakeUser } from '../../../tests/fixtures/user'
import { GetUserByEmailRepository } from './get-user-by-email'

/* eslint-disable no-undef */
describe('GetUserByEmailRepository', () => {
  test('should get user by email on db', async () => {
    // Arrange
    const user = await prisma.user.create({ data: fakeUser })
    const sut = new GetUserByEmailRepository()

    // Act
    const result = await sut.execute(user.email)

    // Assert
    expect(result).toStrictEqual(user)
  })

  test('should call Prisma with correct params', async () => {
    // Arrange
    const sut = new GetUserByEmailRepository()

    const prismaSpy = jest.spyOn(prisma.user, 'findUnique')

    // Act
    await sut.execute(fakeUser.email)

    // Assert
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        email: fakeUser.email,
      },
    })
  })
})
