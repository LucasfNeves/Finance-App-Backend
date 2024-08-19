import { PostgresClient } from '../../../db/postgres/client.js'

export class PostgresGetUserBalanceRepository {
  async execute(userId) {
    const balance = await PostgresClient.query(
      `SELECT * FROM get_user_balance($1)`,
      [userId],
    )

    return {
      userId,
      ...balance[0],
    }
  }
}
