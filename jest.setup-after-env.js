import { prisma } from './prisma/prisma'

// eslint-disable-next-line no-undef
beforeEach(async () => {
  await prisma.transaction.deleteMany({})
  await prisma.user.deleteMany({})
})
