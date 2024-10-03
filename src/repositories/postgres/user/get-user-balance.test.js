import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma'
import { user } from '../../../tests/fixtures/user'
import { PostgresGetUserBalanceRepository } from './get-user-balance'

/* eslint-disable no-undef */
describe('PostgresGetUserBalanceRepository', () => {
  test('should get user balance on db', async () => {
    const createUser = await prisma.user.create({
      data: user,
    })
    await prisma.transaction.createMany({
      data: [
        {
          name: faker.string.sample(),
          amount: 5000,
          type: 'EARNING',
          user_id: createUser.id,
          date: faker.date.recent(),
        },
        {
          name: faker.string.sample(),
          amount: 5000,
          type: 'EARNING',
          user_id: createUser.id,
          date: faker.date.recent(),
        },
        {
          name: faker.string.sample(),
          amount: 1000,
          type: 'EXPENSE',
          user_id: createUser.id,
          date: faker.date.recent(),
        },
        {
          name: faker.string.sample(),
          amount: 1000,
          type: 'EXPENSE',
          user_id: createUser.id,
          date: faker.date.recent(),
        },
        {
          name: faker.string.sample(),
          amount: 3000,
          type: 'INVESTMENT',
          user_id: createUser.id,
          date: faker.date.recent(),
        },
        {
          name: faker.string.sample(),
          amount: 3000,
          type: 'INVESTMENT',
          user_id: createUser.id,
          date: faker.date.recent(),
        },
      ],
    })

    const sut = new PostgresGetUserBalanceRepository()

    const result = await sut.execute(createUser.id)

    expect(result.earnings.toString()).toBe('10000')
    expect(result.expenses.toString()).toBe('2000')
    expect(result.investments.toString()).toBe('6000')
    expect(result.balance.toString()).toBe('2000')
  })
})
