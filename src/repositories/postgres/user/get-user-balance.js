import { prisma } from '../../../../prisma/prisma.js'

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

    const _totalExpenses = totalExpenses || 0
    const _totalEarnings = totalEarnings || 0
    const _totalInvestments = totalInvestments || 0

    const balance = _totalEarnings - _totalExpenses - _totalInvestments

    return {
      user_id,
      totalExpenses: _totalExpenses,
      totalEarnings: _totalEarnings,
      totalInvestments: _totalInvestments,
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
