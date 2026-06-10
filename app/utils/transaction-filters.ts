import {
  addDaysToDateString,
  getTodayJakartaDateString,
} from '~~/shared/utils/jakarta-date'

export type TransactionTypeFilter = 'all' | 'INCOME' | 'OUTCOME'

export interface TransactionFilterState {
  type: TransactionTypeFilter
  source: string
  date: string
}

function isValidDateString(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

export function getDefaultTransactionDate(): string {
  return getTodayJakartaDateString()
}

export function parseTransactionFiltersFromQuery(query: Record<string, unknown>): TransactionFilterState {
  const type = query.type === 'INCOME' || query.type === 'OUTCOME'
    ? query.type
    : 'all'

  const source = typeof query.source === 'string' && query.source.trim()
    ? query.source.trim()
    : 'all'

  const date = typeof query.date === 'string' && isValidDateString(query.date.trim())
    ? query.date.trim()
    : getDefaultTransactionDate()

  return { type, source, date }
}

export function buildTransactionFilterQuery(filters: TransactionFilterState): Record<string, string> {
  const query: Record<string, string> = {
    date: filters.date,
  }

  if (filters.type !== 'all') {
    query.type = filters.type
  }

  if (filters.source !== 'all') {
    query.source = filters.source
  }

  return query
}

export function hasActiveTransactionFilters(filters: TransactionFilterState): boolean {
  return filters.type !== 'all' || filters.source !== 'all'
}

export function isDefaultTransactionDate(date: string): boolean {
  return date === getDefaultTransactionDate()
}

export function getAdjacentTransactionDate(date: string, offsetDays: number): string | null {
  return addDaysToDateString(date, offsetDays)
}
