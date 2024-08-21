import { prisma } from '../../../../prisma/prisma.js'

export class PostgresUpdateUserRepository {
  async execute(userId, updateUserParams) {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: updateUserParams,
    })

    return user

    // // Arrays para armazenar os campos e valores de atualização
    // const updateFields = []
    // const updateValues = []

    // // Itera sobre as chaves do objeto updateUserParams para criar as partes da consulta
    // Object.keys(updateUserParams).forEach((key) => {
    //   updateFields.push(`${key} = $${updateValues.length + 1}`)
    //   updateValues.push(updateUserParams[key])
    // })

    // // Adiciona o userId como último parâmetro
    // updateValues.push(userId)

    // // Cria a consulta de atualização
    // const updateQuery = `
    //   UPDATE users
    //   SET ${updateFields.join(', ')}
    //   WHERE id = $${updateValues.length}
    //   RETURNING *
    // `

    // // Executa a consulta
    // const result = await PostgresClient.query(updateQuery, updateValues)

    // // Retorna a primeira linha do resultado
    // return result[0]
  }
}
