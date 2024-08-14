import { CreateTransactionController } from '../../controllers/transactions/create-transaction.js'
import { PostgresCreateTransactionsRepository } from '../../repositories/postgres/transactions/create-transactions.js'
import { PostgresGetUserByIdRepository } from '../../repositories/postgres/user/get-user-by-id.js'
import { CreateTransactionUseCase } from '../../use-cases/transactions/create-transactions.js'

export const makeCreateTransactionController = () => {
  const createTransactionRepository = new PostgresCreateTransactionsRepository()

  const getUserByIdRepository = new PostgresGetUserByIdRepository()

  const createTransactionUseCase = new CreateTransactionUseCase(
    createTransactionRepository,
    getUserByIdRepository,
  )

  const createTransactionController = new CreateTransactionController(
    createTransactionUseCase,
  )
  return createTransactionController
}
