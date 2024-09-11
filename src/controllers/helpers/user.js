import { userNotFound } from './http.js'

// export const generateInvalidPasswordResponse = () => {
//   return baadRequest({
//     message: 'Password must be at least 6 characters',
//   })
// }

// export const generateEmailAlreadyInUseResponse = () => {
//   return baadRequest({
//     message: 'Invalid e-mail, please provide valid one.',
//   })
// }

// export const requiredFieldsMissingResponse = (field) => {
//   return baadRequest({
//     message: `The field ${field} is required`,
//   })
// }

export const userNotFoundResponse = () => {
  return userNotFound({ message: 'User not found' })
}

// export const checkIfPasswordIsValid = (password) => password.length >= 6

// export const checkIfEmailIsValid = (email) => validator.isEmail(email)
