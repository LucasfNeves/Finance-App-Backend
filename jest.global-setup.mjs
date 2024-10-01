import { execSync } from 'child_process'

async function init() {
  // Subir o container do PostgreSQL
  execSync('docker-compose up -d --wait postgres-test')

  // Sincronizar o esquema do banco de dados com o Prisma
  execSync('npx prisma db push')
}

export default init
