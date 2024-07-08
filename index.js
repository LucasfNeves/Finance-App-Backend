import 'dotenv/config.js'
import express from 'express'
import { PostgresClient } from './src/db/postgres/client.js'

const app = express()

app.get('/', async (req, res) => {
  const results = await PostgresClient.query('SELECT * FROM users')

  return res.send(JSON.stringify(results))
})

const port = 3000

app.listen(port, () => console.log(`listening on port ${port}`))
