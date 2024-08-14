import { PostgresClient } from '../../../db/postgres/client'

export class PostgresGetTransactionsByUserId {
  async execute(userId) {
    const transactions = await PostgresClient.query(
      'SELECT * FROM transactions WHERE user_id = $1',
      [userId],
    )

    return transactions
  }
}
