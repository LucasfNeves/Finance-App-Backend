import validator from 'validator'
import { baadRequest } from './http.js'

export const generateInvalidPasswordResponse = () => {
  return baadRequest({
    message: 'Password must be at least 6 characters',
  })
}

export const generateEmailAlreadyInUseResponse = () => {
  return baadRequest({
    message: 'Invalid e-mail, please provide valid one.',
  })
}

export const generateInvalidIdResponse = () => {
  return baadRequest({
    message: 'The provided id is not valid',
  })
}

export const checkIfPasswordIsValid = (password) => password.length >= 6

export const checkIfEmailIsValid = (email) => validator.isEmail(email)

export const checkIfIdIsValid = (userId) => validator.isUUID(userId)
