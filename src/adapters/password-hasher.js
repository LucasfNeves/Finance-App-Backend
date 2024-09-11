import bcrypt from 'bcrypt'

export class PasswordHasherAdpter {
  async execute(password) {
    return await bcrypt.hash(password, 10)
  }
}
