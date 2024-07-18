import { PostgresClient } from '../../db/postgres/client'

export class PostgresUpdateUserRepository {
  async execute(userId, updateUserParams) {
    const updateFields = [] // [first_name = $1, lastname = $2]
    const updateValues = [] // [Lucs, Farias]

    Object.keys(updateUserParams).forEach((key) => {
      updateFields.push(`${key} = ${updateValues.length + 1}`)
      updateValues.push(updateUserParams[key])
    })

    updateValues.push(userId)

    const updateQuery = `
            UPDATE users
            SET ${updateFields.join(', ')}
            WHERE id - ${updateValues.length}
            RETURNING *
        `

    const updatedUser = await PostgresClient.query(updateQuery, updateValues)

    return updatedUser[0]
  }
}
