import { TransactionType } from '../../generated/prisma/client'
import {
  DEFAULT_SOURCES,
  INCOME_CATEGORIES,
  OUTCOME_CATEGORIES,
} from '../../shared/constants/transaction-options'
import { prisma } from './prisma'

export async function seedDefaultMastersForUser(userId: string) {
  await prisma.source.createMany({
    data: DEFAULT_SOURCES.map((name, index) => ({
      userId,
      name,
      sortOrder: index,
      isSystem: true,
    })),
  })

  await prisma.category.createMany({
    data: [
      ...INCOME_CATEGORIES.map(name => ({
        userId,
        type: TransactionType.INCOME,
        name,
        isSystem: true,
      })),
      ...OUTCOME_CATEGORIES.map(name => ({
        userId,
        type: TransactionType.OUTCOME,
        name,
        isSystem: true,
      })),
    ],
  })
}
