import validator from 'validator'
import { baadRequest } from './http.js'

export const checkIfIdIsValid = (userId) => validator.isUUID(userId)

export const generateInvalidIdResponse = () => {
  return baadRequest({
    message: 'The provided id is not valid',
  })
}

// export const checkIfIsString = (value) => typeof value === 'string'

// export const validateRequiredFields = (params, reqiredFields) => {
//   for (const field of reqiredFields) {
//     const fieldIsMissing = !params[field]
//     const fieldIsEmpty =
//       checkIfIsString(params[field]) &&
//       validator.isEmpty(params[field], {
//         ignore_whitespace: true,
//       })

//     if (fieldIsMissing || fieldIsEmpty) {
//       return {
//         missingField: field,
//         ok: false,
//       }
//     }
//   }

//   return {
//     ok: true,
//     missingField: undefined,
//   }
// }
