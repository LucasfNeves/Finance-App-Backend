import {
  CreateUserController,
  DeleteUserController,
  GetUserByIdController,
  UpdateUserController,
} from '../../controllers/index.js'
import { PostgresCreateUserRepository } from '../../repositories/postgres/user/create-user.js'
import { PostgresDeleteUserRepository } from '../../repositories/postgres/user/delete-user.js'
import { GetUserByEmailRepository } from '../../repositories/postgres/user/get-user-by-email.js'
import { PostgresGetUserByIdRepository } from '../../repositories/postgres/user/get-user-by-id.js'
import { PostgresUpdateUserRepository } from '../../repositories/postgres/user/update-user.js'
import { CreateUserUseCase } from '../../use-cases/user/create-user.js'
import { DeleteUserUseCase } from '../../use-cases/user/delete-user.js'
import { GetUserByIdUseCase } from '../../use-cases/user/get-user-by-id.js'
import { UpdateUserUseCase } from '../../use-cases/user/update-user.js'

export const makeGetUserByIdController = () => {
  const getUserByIdRepository = new PostgresGetUserByIdRepository()

  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)

  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

  return getUserByIdController
}

export const makeCreateUserController = () => {
  const getUserByEmailRepository = new GetUserByEmailRepository()

  const createUserRepository = new PostgresCreateUserRepository()

  const createUserUseCase = new CreateUserUseCase(
    getUserByEmailRepository,
    createUserRepository,
  )

  const createUserController = new CreateUserController(createUserUseCase)

  return createUserController
}

export const makeUpdateUserController = () => {
  const getUserByIdRepository = new PostgresGetUserByIdRepository()

  const updateUserRepository = new PostgresUpdateUserRepository()

  const updateUserUseCase = new UpdateUserUseCase(
    getUserByIdRepository,
    updateUserRepository,
  )

  const updateUserController = new UpdateUserController(updateUserUseCase)

  return updateUserController
}

export const makeDeleteUserController = () => {
  const deleteUserRepository = new PostgresDeleteUserRepository()

  const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository)

  const deleteUserController = new DeleteUserController(deleteUserUseCase)

  return deleteUserController
}
