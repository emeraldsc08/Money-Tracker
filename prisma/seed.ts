import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient, TransactionType } from '../generated/prisma/client'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is not set')
}

const adapter = new PrismaBetterSqlite3({ url: connectionString })
import {
  DEFAULT_SOURCES,
  INCOME_CATEGORIES,
  OUTCOME_CATEGORIES,
} from '../shared/constants/transaction-options'

const prisma = new PrismaClient({ adapter })

const sampleTransactions = [
  {
    type: TransactionType.INCOME,
    date: new Date('2026-06-01T09:00:00'),
    source: DEFAULT_SOURCES[1],
    amount: 8_500_000,
    title: 'Gaji Bulan Juni',
    category: INCOME_CATEGORIES[0],
    description: 'Transfer payroll',
  },
  {
    type: TransactionType.OUTCOME,
    date: new Date('2026-06-02T12:30:00'),
    source: DEFAULT_SOURCES[4],
    amount: 45_000,
    title: 'Makan Siang',
    category: OUTCOME_CATEGORIES[0],
    description: null,
  },
  {
    type: TransactionType.OUTCOME,
    date: new Date('2026-06-03T08:15:00'),
    source: DEFAULT_SOURCES[2],
    amount: 25_000,
    title: 'Ojek Online',
    category: OUTCOME_CATEGORIES[1],
    description: 'Ke kantor',
  },
  {
    type: TransactionType.INCOME,
    date: new Date('2026-06-05T14:00:00'),
    source: DEFAULT_SOURCES[1],
    amount: 1_500_000,
    title: 'Proyek Desain Logo',
    category: INCOME_CATEGORIES[1],
    description: 'Freelance client A',
  },
  {
    type: TransactionType.OUTCOME,
    date: new Date('2026-06-07T19:00:00'),
    source: DEFAULT_SOURCES[5],
    amount: 350_000,
    title: 'Belanja Bulanan',
    category: OUTCOME_CATEGORIES[3],
    description: 'Kebutuhan rumah tangga',
  },
] as const

async function main() {
  const existingCount = await prisma.transaction.count()
  if (existingCount > 0) {
    console.log(`Seed skipped: ${existingCount} transaction(s) already exist.`)
    return
  }

  for (const transaction of sampleTransactions) {
    await prisma.transaction.create({ data: transaction })
  }

  console.log(`Seeded ${sampleTransactions.length} sample transactions.`)
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
