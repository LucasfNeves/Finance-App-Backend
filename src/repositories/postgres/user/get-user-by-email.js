import { prisma } from '../../../../prisma/prisma.js'

export class GetUserByEmailRepository {
  async execute(email) {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    })

    return user

    // const user = await PostgresClient.query(
    //   'SELECT * FROM users WHERE email = $1',
    //   [email],
    // )

    // return user[0]
  }
}
