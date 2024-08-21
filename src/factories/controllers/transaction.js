import { CreateTransactionController } from '../../controllers/transactions/create-transaction.js'
import { DeleteTransactionController } from '../../controllers/transactions/delete-transaction.js'
import { GetTransactionsByUserIdController } from '../../controllers/transactions/get-transactions-by-user-id.js'
import { UpdateTransactionController } from '../../controllers/transactions/update-transaction.js'
import { PostgresCreateTransactionsRepository } from '../../repositories/postgres/transactions/create-transactions.js'
import { PostgresDeleteTransactionRepository } from '../../repositories/postgres/transactions/delete-transaction.js'
import { PostgresGetTransactionsByUserId } from '../../repositories/postgres/transactions/get-transactions-by-user-id.js'
import { PostgresUpdateTransactionRepository } from '../../repositories/postgres/transactions/update-transactions.js'
import { PostgresGetUserByIdRepository } from '../../repositories/postgres/user/get-user-by-id.js'
import { CreateTransactionUseCase } from '../../use-cases/transactions/create-transactions.js'
import { DeleteTransactionUseCase } from '../../use-cases/transactions/delete-transaction.js'
import { GetTransactionsByUserIdUseCase } from '../../use-cases/transactions/get-transactions-by-user-id.js'
import { UpdateTransactionUseCase } from '../../use-cases/transactions/update-transaction.js'

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

export const makeGetTransactionsByIdController = () => {
  const getTransactionsByUserIdRepository =
    new PostgresGetTransactionsByUserId()

  const getUserByIdRepository = new PostgresGetUserByIdRepository()

  const getTransactionsByUsrIdUseCase = new GetTransactionsByUserIdUseCase(
    getTransactionsByUserIdRepository,
    getUserByIdRepository,
  )

  const getTransactionsByUserIdController =
    new GetTransactionsByUserIdController(getTransactionsByUsrIdUseCase)

  return getTransactionsByUserIdController
}

export const makeUpdateTransactionController = () => {
  const updateTransactionRepository = new PostgresUpdateTransactionRepository()

  const updateTransactionUseCase = new UpdateTransactionUseCase(
    updateTransactionRepository,
  )

  const updateTransactionController = new UpdateTransactionController(
    updateTransactionUseCase,
  )

  return updateTransactionController
}

export const makeDeleteTransactionController = () => {
  const deleteTransactionRepository = new PostgresDeleteTransactionRepository()

  const deleteTransactionUseCase = new DeleteTransactionUseCase(
    deleteTransactionRepository,
  )

  const deleteTransactionController = new DeleteTransactionController(
    deleteTransactionUseCase,
  )

  return deleteTransactionController
}
