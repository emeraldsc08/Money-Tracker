import { Hash } from '@adonisjs/hash'
import { Scrypt } from '@adonisjs/hash/drivers/scrypt'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient, TransactionType } from '../generated/prisma/client'
import {
  DEFAULT_SOURCES,
  INCOME_CATEGORIES,
  OUTCOME_CATEGORIES,
} from '../shared/constants/transaction-options'
import { seedDefaultMastersForUser } from '../server/utils/user-defaults'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is not set')
}

const adapter = new PrismaBetterSqlite3({ url: connectionString })
const prisma = new PrismaClient({ adapter })

const hash = new Hash(new Scrypt({}))

const DEMO_EMAIL = 'demo@moneytracker.local'
const DEMO_PASSWORD = 'demo1234'
const DEMO_NAME = 'Demo User'

const sampleTransactions = [
  {
    type: TransactionType.INCOME,
    date: new Date('2026-06-01T09:00:00'),
    sourceName: DEFAULT_SOURCES[1],
    amount: 8_500_000,
    title: 'Gaji Bulan Juni',
    categoryName: INCOME_CATEGORIES[0],
    description: 'Transfer payroll',
  },
  {
    type: TransactionType.OUTCOME,
    date: new Date('2026-06-02T12:30:00'),
    sourceName: DEFAULT_SOURCES[4],
    amount: 45_000,
    title: 'Makan Siang',
    categoryName: OUTCOME_CATEGORIES[0],
    description: null,
  },
  {
    type: TransactionType.OUTCOME,
    date: new Date('2026-06-03T08:15:00'),
    sourceName: DEFAULT_SOURCES[2],
    amount: 25_000,
    title: 'Ojek Online',
    categoryName: OUTCOME_CATEGORIES[1],
    description: 'Ke kantor',
  },
  {
    type: TransactionType.INCOME,
    date: new Date('2026-06-05T14:00:00'),
    sourceName: DEFAULT_SOURCES[1],
    amount: 1_500_000,
    title: 'Proyek Desain Logo',
    categoryName: INCOME_CATEGORIES[1],
    description: 'Freelance client A',
  },
  {
    type: TransactionType.OUTCOME,
    date: new Date('2026-06-07T19:00:00'),
    sourceName: DEFAULT_SOURCES[5],
    amount: 350_000,
    title: 'Belanja Bulanan',
    categoryName: OUTCOME_CATEGORIES[3],
    description: 'Kebutuhan rumah tangga',
  },
] as const

async function main() {
  const existingUser = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
  })

  if (existingUser) {
    console.log('Seed skipped: demo user already exists.')
    return
  }

  const passwordHash = await hash.make(DEMO_PASSWORD)

  const user = await prisma.user.create({
    data: {
      email: DEMO_EMAIL,
      passwordHash,
      name: DEMO_NAME,
    },
  })

  await seedDefaultMastersForUser(user.id)

  for (const transaction of sampleTransactions) {
    const source = await prisma.source.findUnique({
      where: {
        userId_name: {
          userId: user.id,
          name: transaction.sourceName,
        },
      },
    })

    const category = await prisma.category.findUnique({
      where: {
        userId_type_name: {
          userId: user.id,
          type: transaction.type,
          name: transaction.categoryName,
        },
      },
    })

    if (!source || !category) {
      throw new Error(`Missing master data for seed transaction: ${transaction.title}`)
    }

    await prisma.transaction.create({
      data: {
        userId: user.id,
        type: transaction.type,
        date: transaction.date,
        sourceId: source.id,
        categoryId: category.id,
        amount: transaction.amount,
        title: transaction.title,
        description: transaction.description,
      },
    })
  }

  console.log(`Seeded demo user (${DEMO_EMAIL} / ${DEMO_PASSWORD}) with ${sampleTransactions.length} transactions.`)
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
