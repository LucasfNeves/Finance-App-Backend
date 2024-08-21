import { prisma } from '../../../../prisma/prisma.js'

export class PostgresCreateTransactionsRepository {
  async execute(createTransactionParams) {
    const transaction = await prisma.transaction.create({
      data: createTransactionParams,
    })

    return transaction

    // const createdTransactions = await PostgresClient.query(
    //   `
    //   INSERT INTO transactions
    //   (id, user_id, name, date, amount, type)
    //   VALUES ($1, $2, $3, $4, $5, $6)
    //   RETURNING *
    //   `,
    //   [
    //     createTransactionParams.id,
    //     createTransactionParams.user_id,
    //     createTransactionParams.name,
    //     createTransactionParams.date,
    //     createTransactionParams.amount,
    //     createTransactionParams.type,
    //   ],
    // )

    // return createdTransactions[0]
  }
}
