import validator from 'validator'
import { baadRequest } from './http.js'

export const checkIfIdIsValid = (userId) => validator.isUUID(userId)

export const generateInvalidIdResponse = () => {
  return baadRequest({
    message: 'The provided id is not valid',
  })
}
