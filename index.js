/* eslint-disable no-undef */
import 'dotenv/config.js'
import express from 'express'
import {
  CreateUserController,
  UpdateUserController,
  GetUserByIdController,
  DeleteUserController,
} from './src/controllers/index.js'
import { GetUserByIdUseCase } from './src/use-cases/get-user-by-id.js'
import { PostgresGetUserByIdRepository } from './src/repositories/postgres/get-user-by-id.js'
import { PostgresCreateUserRepository } from './src/repositories/postgres/create-user.js'
import { CreateUserUseCase } from './src/use-cases/create-user.js'
import { GetUserByEmailRepository } from './src/repositories/postgres/get-user-by-email.js'

const app = express()

app.use(express.json())

app.post('/api/users', async (request, response) => {
  const getUserByEmailRepository = new GetUserByEmailRepository()

  const createUserRepository = new PostgresCreateUserRepository()

  const createUserUseCase = new CreateUserUseCase(
    getUserByEmailRepository,
    createUserRepository,
  )

  const createUserController = new CreateUserController(createUserUseCase)

  const createUserResponse = await createUserController.execute(request)

  response.status(createUserResponse.statusCode).send(createUserResponse.body)
})

app.get('/api/users/:userId', async (request, response) => {
  const getUserByIdRepository = new PostgresGetUserByIdRepository()

  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)

  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

  const { statusCode, body } = await getUserByIdController.execute(request)

  response.status(statusCode).send(body)
})

app.patch('/api/users/:userId', async (request, response) => {
  const updateUserController = new UpdateUserController()

  const { statusCode, body } = await updateUserController.execute(request)

  response.status(statusCode).send(body)
})

app.delete('/api/users/:userId', async (request, response) => {
  const deleteUserController = new DeleteUserController()

  const { statusCode, body } = await deleteUserController.execute(request)

  response.status(statusCode).send(body)
})

app.listen(process.env.PORT, () =>
  console.log(`listening on port ${process.env.PORT}`),
)
