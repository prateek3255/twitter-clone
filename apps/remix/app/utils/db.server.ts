import { PrismaClient } from 'database';

let prisma: PrismaClient
declare global {
  var __db: PrismaClient | undefined
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
  prisma.$connect()
} else {
  if (!global.__db) {
    global.__db = new PrismaClient()
    global.__db.$connect()
  }
  prisma = global.__db
}

export { prisma };
