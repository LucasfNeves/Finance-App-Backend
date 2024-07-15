import { PostgresClient } from '../../db/postgres/client.js'

export class GetUserByEmailRepository {
  async execute(email) {
    const user = await PostgresClient.query(
      'SELECT * FROM users WHERE email = $1',
      [email],
    )

    return user[0]
  }
}
