import 'dotenv/config.js'
import fs from 'fs'
import { pool } from '../client.js'
import { fileURLToPath } from 'url'
import path from 'path'

// Capturar o dirname name de um arquivo utilizando es-modules

// Transforma a URL do arquivo em um caminho tradicional de URL, remove o "file://"
const _filename = fileURLToPath(import.meta.url)

// captura o dirname (nome do diretório) so _filename
const _dirname = path.dirname(_filename)

const execMigrations = async () => {
  const client = await pool.connect()

  try {
    const filePath = path.join(_dirname, '01-init.sql')
    const script = fs.readFileSync(filePath, 'utf-8')

    client.query(script)

    console.log('Migrations execute succesfully')
  } catch (error) {
    console.log(error)
  } finally {
    client.release()
  }
}

execMigrations()
