import { prisma } from '../../../../prisma/prisma.js'

export class PostgresGetUserByIdRepository {
  async execute(userId) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    return user

    // const user = await PostgresClient.query(
    //   'SELECT * FROM users WHERE id = $1',
    //   [userId],
    // )

    // return user[0]
  }
}
