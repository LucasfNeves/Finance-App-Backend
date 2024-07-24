import { PostgresClient } from '../../db/postgres/client'

export class PostgresDeleteUser {
  async execute(userId) {
    const deletedUser = await PostgresClient.query(
      `
            DELETE FROM users 
            WHERE id = $1
            RETURNING * 
            `,
      [userId],
    )

    return deletedUser[0]
  }
}
