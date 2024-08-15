import { PostgresClient } from '../../../db/postgres/client'

export class PostgresUpdateTransactionRepository {
  async execute(userId, updateTransactionParams) {
    // Arrays para armazenar os campos e valores de atualização
    const updateFields = []
    const updateValues = []

    // Itera sobre as chaves do objeto updateUserParams para criar as partes da consulta
    Object.keys(updateTransactionParams).forEach((key) => {
      updateFields.push(`${key} = $${updateValues.length + 1}`)
      updateValues.push(updateTransactionParams[key])
    })

    // Adiciona o userId como último parâmetro
    updateValues.push(userId)

    // Cria a consulta de atualização
    const updateQuery = `
      UPDATE users
      SET ${updateFields.join(', ')}
      WHERE id = $${updateValues.length}
      RETURNING *
    `

    // Executa a consulta
    const result = await PostgresClient.query(updateQuery, updateValues)

    // Retorna a primeira linha do resultado
    return result[0]
  }
}
