import { TransactionType } from '../../generated/prisma/client'
import type {
  CategoryBreakdownItem,
  MonthlyDetailReport,
  MonthlySummaryItem,
} from '../../shared/types/report'
import { getJakartaYmd, monthBoundsJakarta } from '../../shared/utils/jakarta-date'
import { formatMonthLabel } from '../../shared/utils/month-format'
import { serializeTransactions } from './transaction-serializer'

function toNumber(value: unknown): number {
  return Number(value)
}

function withCategoryPercentages(
  items: Array<{ category: string, amount: number }>,
  total: number,
): CategoryBreakdownItem[] {
  return items
    .sort((left, right) => right.amount - left.amount)
    .map(item => ({
      category: item.category,
      amount: item.amount,
      percentage: total > 0
        ? Math.round((item.amount / total) * 1000) / 10
        : 0,
    }))
}

function monthKey(year: number, month: number): string {
  return `${year}-${month}`
}

export async function buildMonthlyListReport(): Promise<MonthlySummaryItem[]> {
  const transactions = await prisma.transaction.findMany({
    select: {
      date: true,
      type: true,
      amount: true,
    },
    orderBy: { date: 'desc' },
  })

  const grouped = new Map<string, MonthlySummaryItem>()

  for (const transaction of transactions) {
    const { year, month } = getJakartaYmd(transaction.date)
    const key = monthKey(year, month)
    const amount = toNumber(transaction.amount)

    const existing = grouped.get(key) ?? {
      year,
      month,
      label: formatMonthLabel(year, month),
      summary: {
        totalIncome: 0,
        totalOutcome: 0,
        balance: 0,
      },
    }

    if (transaction.type === TransactionType.INCOME) {
      existing.summary.totalIncome += amount
    }
    else {
      existing.summary.totalOutcome += amount
    }

    existing.summary.balance = existing.summary.totalIncome - existing.summary.totalOutcome
    grouped.set(key, existing)
  }

  return Array.from(grouped.values()).sort((left, right) => {
    if (left.year !== right.year) {
      return right.year - left.year
    }
    return right.month - left.month
  })
}

export async function buildMonthlyDetailReport(year: number, month: number): Promise<MonthlyDetailReport> {
  const { from, to } = monthBoundsJakarta(year, month)

  const transactions = await prisma.transaction.findMany({
    where: {
      date: {
        gte: from,
        lte: to,
      },
    },
    orderBy: { date: 'desc' },
  })

  const serialized = serializeTransactions(transactions)

  const incomeByCategoryMap = new Map<string, number>()
  const outcomeByCategoryMap = new Map<string, number>()
  let totalIncome = 0
  let totalOutcome = 0

  for (const transaction of serialized) {
    if (transaction.type === TransactionType.INCOME) {
      totalIncome += transaction.amount
      incomeByCategoryMap.set(
        transaction.category,
        (incomeByCategoryMap.get(transaction.category) ?? 0) + transaction.amount,
      )
    }
    else {
      totalOutcome += transaction.amount
      outcomeByCategoryMap.set(
        transaction.category,
        (outcomeByCategoryMap.get(transaction.category) ?? 0) + transaction.amount,
      )
    }
  }

  return {
    year,
    month,
    label: formatMonthLabel(year, month),
    from: from.toISOString(),
    to: to.toISOString(),
    summary: {
      totalIncome,
      totalOutcome,
      balance: totalIncome - totalOutcome,
    },
    transactions: serialized,
    incomeByCategory: withCategoryPercentages(
      Array.from(incomeByCategoryMap.entries()).map(([category, amount]) => ({ category, amount })),
      totalIncome,
    ),
    outcomeByCategory: withCategoryPercentages(
      Array.from(outcomeByCategoryMap.entries()).map(([category, amount]) => ({ category, amount })),
      totalOutcome,
    ),
  }
}
