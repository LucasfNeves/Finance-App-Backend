import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetTransactionsByUserId {
  async execute(userId) {
    const transaction = await prisma.transaction.findMany({
      where: {
        user_id: userId,
      },
    })

    return transaction

    // const transactions = await PostgresClient.query(
    //   'SELECT * FROM transactions WHERE user_id = $1',
    //   [userId],
    // )

    // console.log(transactions)

    // return transactions
  }
}
