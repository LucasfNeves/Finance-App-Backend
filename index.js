/* eslint-disable no-undef */
import 'dotenv/config.js'
import express from 'express'
import {
  makeCreateUserController,
  makeDeleteUserController,
  makeGetUserByIdController,
  makeUpdateUserController,
} from './src/factories/controllers/user.js'
import {
  makeCreateTransactionController,
  makeGetTransactionsByIdController,
} from './src/factories/controllers/transaction.js'

const app = express()

app.use(express.json())

//! ------------ User Routes ------------

app.post('/api/users', async (request, response) => {
  const createUserController = makeCreateUserController()

  const createUserResponse = await createUserController.execute(request)

  response.status(createUserResponse.statusCode).send(createUserResponse.body)
})

app.get('/api/users/:userId', async (request, response) => {
  const getUserByIdController = makeGetUserByIdController()

  const { statusCode, body } = await getUserByIdController.execute(request)

  response.status(statusCode).send(body)
})

app.patch('/api/users/:userId', async (request, response) => {
  const updateUserController = makeUpdateUserController()

  const { statusCode, body } = await updateUserController.execute(request)

  response.status(statusCode).send(body)
})

app.delete('/api/users/:userId', async (request, response) => {
  const deleteUserController = makeDeleteUserController()

  const { statusCode, body } = await deleteUserController.execute(request)

  response.status(statusCode).send(body)
})

//! ------------ Transaction Routes ------------

app.get('/api/transactions', async (request, response) => {
  const getTransactionsByUseerIdController = makeGetTransactionsByIdController()

  const { statusCode, body } =
    await getTransactionsByUseerIdController.execute(request)

  response.status(statusCode).send(body)
})

app.post('/api/transactions', async (request, response) => {
  const createTransactionController = makeCreateTransactionController()

  const { statusCode, body } =
    await createTransactionController.execute(request)

  response.status(statusCode).send(body)
})

app.listen(process.env.PORT, () =>
  console.log(`listening on port ${process.env.PORT}`),
)
