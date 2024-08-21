import { prisma } from '../../../../prisma/prisma.js'
import { Prisma } from '@prisma/client'

export class PostgresGetUserBalanceRepository {
  async execute(user_id) {
    const {
      _sum: { amount: totalExpenses },
    } = await prisma.transaction.aggregate({
      where: {
        user_id,
        type: 'EXPENSE',
      },
      _sum: {
        amount: true,
      },
    })

    const {
      _sum: { amount: totalEarnings },
    } = await prisma.transaction.aggregate({
      where: {
        user_id,
        type: 'EARNING',
      },
      _sum: {
        amount: true,
      },
    })

    const {
      _sum: { amount: totalInvestments },
    } = await prisma.transaction.aggregate({
      where: {
        user_id,
        type: 'INVESTMENT',
      },
      _sum: {
        amount: true,
      },
    })

    const _totalExpenses = totalExpenses || new Prisma.Decimal(0)
    const _totalEarnings = totalEarnings || new Prisma.Decimal(0)
    const _totalInvestments = totalInvestments || new Prisma.Decimal(0)

    const balance = new Prisma.Decimal(
      _totalEarnings - _totalExpenses - _totalInvestments,
    )

    return {
      expenses: _totalExpenses,
      earnings: _totalEarnings,
      investments: _totalInvestments,
      balance,
    }

    // const balance = await PostgresClient.query(
    //   `SELECT * FROM get_user_balance($1)`,
    //   [userId],
    // )

    // return {
    //   userId,
    //   ...balance[0],
    // }
  }
}
