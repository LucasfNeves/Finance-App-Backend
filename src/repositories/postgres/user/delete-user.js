import { prisma } from '../../../../prisma/prisma.js'

export class PostgresDeleteUserRepository {
  async execute(userId) {
    try {
      const user = await prisma.user.delete({
        where: {
          id: userId,
        },
      })

      return user
    } catch (error) {
      console.log(error)
      return null
    }

    // const deletedUser = await PostgresClient.query(
    //   `
    //         DELETE FROM users
    //         WHERE id = $1
    //         RETURNING *
    //         `,
    //   [userId],
    // )

    // return deletedUser[0]
  }
}
