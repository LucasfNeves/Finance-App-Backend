import bcrypt from 'bcrypt'

export class PasswordHasherAdpter {
  execute(password) {
    return bcrypt.hash(password, 10)
  }
}
