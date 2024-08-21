import { prisma } from '../../../../prisma/prisma.js'

export class PostgresDeleteTransactionRepository {
  async execute(transactionId) {
    const transaction = await prisma.transaction.delete({
      where: {
        id: transactionId,
      },
    })

    return transaction
  }
}
