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

export async function buildRealtimeReport(
  userId: string,
  from: Date,
  to: Date,
): Promise<RealtimeReportData> {
  const dateFilter = {
    gte: from,
    lte: to,
  }

  const baseWhere = {
    userId,
    date: dateFilter,
  }

  const [groupedBySource, groupedByCategory, sources, categories] = await Promise.all([
    prisma.transaction.groupBy({
      by: ['type', 'sourceId'],
      where: baseWhere,
      _sum: { amount: true },
    }),
    prisma.transaction.groupBy({
      by: ['type', 'categoryId'],
      where: baseWhere,
      _sum: { amount: true },
    }),
    prisma.source.findMany({ where: { userId } }),
    prisma.category.findMany({ where: { userId } }),
  ])

  const sourceNameById = new Map(sources.map(source => [source.id, source.name]))
  const categoryNameById = new Map(categories.map(category => [category.id, category.name]))

  const sourceRows: SourceAggregateRow[] = groupedBySource.map(row => ({
    type: row.type,
    source: sourceNameById.get(row.sourceId) ?? 'Unknown',
    amount: toNumber(row._sum.amount ?? 0),
  }))

  const categoryRows: CategoryAggregateRow[] = groupedByCategory.map(row => ({
    type: row.type,
    category: categoryNameById.get(row.categoryId) ?? 'Unknown',
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
