import { TransactionType } from '../../generated/prisma/client'
import type {
  CategoryBreakdownItem,
  RealtimeReportData,
  SourceBreakdownItem,
} from '../../shared/types/report'

interface SourceAggregateRow {
  type: TransactionType
  source: string
  amount: number
}

interface CategoryAggregateRow {
  type: TransactionType
  category: string
  amount: number
}

function toNumber(value: unknown): number {
  return Number(value)
}

function withSourcePercentages(
  items: Array<{ source: string, amount: number }>,
  total: number,
): SourceBreakdownItem[] {
  return items
    .sort((left, right) => right.amount - left.amount)
    .map(item => ({
      source: item.source,
      amount: item.amount,
      percentage: total > 0
        ? Math.round((item.amount / total) * 1000) / 10
        : 0,
    }))
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

export async function buildRealtimeReport(from: Date, to: Date): Promise<RealtimeReportData> {
  const dateFilter = {
    gte: from,
    lte: to,
  }

  const [groupedBySource, groupedByCategory] = await Promise.all([
    prisma.transaction.groupBy({
      by: ['type', 'source'],
      where: { date: dateFilter },
      _sum: { amount: true },
    }),
    prisma.transaction.groupBy({
      by: ['type', 'category'],
      where: { date: dateFilter },
      _sum: { amount: true },
    }),
  ])

  const sourceRows: SourceAggregateRow[] = groupedBySource.map(row => ({
    type: row.type,
    source: row.source,
    amount: toNumber(row._sum.amount ?? 0),
  }))

  const categoryRows: CategoryAggregateRow[] = groupedByCategory.map(row => ({
    type: row.type,
    category: row.category,
    amount: toNumber(row._sum.amount ?? 0),
  }))

  const incomeSourceRows = sourceRows.filter(row => row.type === TransactionType.INCOME)
  const outcomeSourceRows = sourceRows.filter(row => row.type === TransactionType.OUTCOME)
  const incomeCategoryRows = categoryRows.filter(row => row.type === TransactionType.INCOME)
  const outcomeCategoryRows = categoryRows.filter(row => row.type === TransactionType.OUTCOME)

  const totalIncome = incomeSourceRows.reduce((sum, row) => sum + row.amount, 0)
  const totalOutcome = outcomeSourceRows.reduce((sum, row) => sum + row.amount, 0)

  return {
    from: from.toISOString(),
    to: to.toISOString(),
    summary: {
      totalIncome,
      totalOutcome,
      balance: totalIncome - totalOutcome,
    },
    incomeBySource: withSourcePercentages(incomeSourceRows, totalIncome),
    outcomeBySource: withSourcePercentages(outcomeSourceRows, totalOutcome),
    incomeByCategory: withCategoryPercentages(incomeCategoryRows, totalIncome),
    outcomeByCategory: withCategoryPercentages(outcomeCategoryRows, totalOutcome),
  }
}
