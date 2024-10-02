import { prisma } from './prisma/prisma'

// eslint-disable-next-line no-undef
beforeEach(async () => {
  await prisma.user.deleteMany({})
  await prisma.transaction.deleteMany({})
})
