import { CreateTransactionController } from '../../controllers/transactions/create-transaction'
import { PostgresCreateTransactionsRepository } from '../../repositories/postgres/transactions/create-transactions'
import { PostgresGetUserByIdRepository } from '../../repositories/postgres/user/get-user-by-id'
import { CreateTransactionUseCase } from '../../use-cases/transactions/create-transactions'

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
