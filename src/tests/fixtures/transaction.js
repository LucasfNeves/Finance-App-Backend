import { faker } from '@faker-js/faker'

export const transaction = {
  id: faker.string.uuid(),
  user_id: faker.string.uuid(),
  name: faker.commerce.productName(),
  date: faker.date.anytime().toISOString(),
  type: 'EXPENSE',
  amount: Number(faker.finance.amount()),
}

export const userBalance = {
  earnings: faker.finance.amount(),
  expenses: faker.finance.amount(),
  investments: faker.finance.amount(),
  balance: faker.finance.amount(),
}
