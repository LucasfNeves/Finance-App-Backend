import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma'
import { user as fakeUser } from '../../../tests/fixtures/user'
import { PostgresUpdateUserRepository } from './update-user'

/* eslint-disable no-undef */
describe('PostgresUpdateUserRepository', () => {
  test('should update user on db', async () => {
    // Arrange
    const user = await prisma.user.create({ data: fakeUser })
    const sut = new PostgresUpdateUserRepository()

    const updateUserParams = {
      id: faker.string.uuid(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }

    // Act
    const result = await sut.execute(user.id, updateUserParams)

    // Assert

    expect(result).toStrictEqual(updateUserParams)
  })
})
