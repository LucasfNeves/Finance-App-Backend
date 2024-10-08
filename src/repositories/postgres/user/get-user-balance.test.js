import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma'
import { user as fakeUser } from '../../../tests/fixtures/user'
import { PostgresGetUserBalanceRepository } from './get-user-balance'
import { TransactionType } from '@prisma/client'

/* eslint-disable no-undef */
describe('PostgresGetUserBalanceRepository', () => {
  test('should get user balance on db', async () => {
    const user = await prisma.user.create({ data: fakeUser })

    await prisma.transaction.createMany({
      data: [
        {
          name: faker.string.sample(),
          amount: 5000,
          date: faker.date.recent(),
          type: 'EARNING',
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          amount: 5000,
          date: faker.date.recent(),
          type: 'EARNING',
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          amount: 1000,
          date: faker.date.recent(),
          type: 'EXPENSE',
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          amount: 1000,
          date: faker.date.recent(),
          type: 'EXPENSE',
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          amount: 3000,
          date: faker.date.recent(),
          type: 'INVESTMENT',
          user_id: user.id,
        },
        {
          name: faker.string.sample(),
          amount: 3000,
          date: faker.date.recent(),
          type: 'INVESTMENT',
          user_id: user.id,
        },
      ],
    })

    const sut = new PostgresGetUserBalanceRepository()

    const result = await sut.execute(user.id)

    expect(result.earnings.toString()).toBe('10000')
    expect(result.expenses.toString()).toBe('2000')
    expect(result.investments.toString()).toBe('6000')
    expect(result.balance.toString()).toBe('2000')
  })

  test('should call Prisma with correct params', async () => {
    const sut = new PostgresGetUserBalanceRepository()

    const prismaSpy = jest.spyOn(prisma.transaction, 'aggregate')

    await sut.execute(fakeUser.id)

    expect(prismaSpy).toHaveBeenCalledTimes(3)
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fakeUser.id,
        type: TransactionType.EXPENSE,
      },
      _sum: {
        amount: true,
      },
    })

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fakeUser.id,
        type: TransactionType.EARNING,
      },
      _sum: {
        amount: true,
      },
    })

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        user_id: fakeUser.id,
        type: TransactionType.INVESTMENT,
      },
      _sum: {
        amount: true,
      },
    })
  })

  test('should throw if Prisma throws', async () => {
    // Arrange
    const sut = new PostgresGetUserBalanceRepository()

    jest
      .spyOn(prisma.transaction, 'aggregate')
      .mockRejectedValueOnce(new Error())

    // Act
    const promise = sut.execute(fakeUser.id)

    // Assert
    await expect(promise).rejects.toThrow()
  })
})
