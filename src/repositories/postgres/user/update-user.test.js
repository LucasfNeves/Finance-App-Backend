import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma'
import { user as fakeUser } from '../../../tests/fixtures/user'
import { PostgresUpdateUserRepository } from './update-user'

/* eslint-disable no-undef */
describe('PostgresUpdateUserRepository', () => {
  const updateUserParams = {
    id: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }

  test('should update user on db', async () => {
    // Arrange
    const user = await prisma.user.create({ data: fakeUser })
    const sut = new PostgresUpdateUserRepository()

    // Act
    const result = await sut.execute(user.id, updateUserParams)

    // Assert

    expect(result).toStrictEqual(updateUserParams)
  })

  test('should call Prisma with correct params', async () => {
    // Arrange
    const user = await prisma.user.create({ data: fakeUser })
    const sut = new PostgresUpdateUserRepository()

    const prismaSpy = jest.spyOn(prisma.user, 'update')

    // Act
    await sut.execute(user.id, updateUserParams)

    // Assert
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        id: user.id,
      },
      data: updateUserParams,
    })
  })

  test('should throw if Prisma throws', async () => {
    // Arrange
    const sut = new PostgresUpdateUserRepository()

    jest.spyOn(prisma.user, 'update').mockRejectedValueOnce(new Error())

    // Act
    const promise = sut.execute(updateUserParams)

    // Assert
    await expect(promise).rejects.toThrow()
  })
})
