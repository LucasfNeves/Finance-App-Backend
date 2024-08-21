import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetUserBalanceRepository {
  async execute(userId) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    return user

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
