import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let adapter
let prismaInstance

if (process.env.DATABASE_URL) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  adapter = new PrismaPg(pool)
  
  prismaInstance = new PrismaClient({ adapter })
} else {
  // Fallback for development without DB - mock client
  prismaInstance = {} as PrismaClient
}

export const prisma = prismaInstance

// Prevent hot-reloading from creating multiple instances in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prismaInstance
}

export default prisma
