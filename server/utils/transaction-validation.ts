import { TransactionType } from '../../generated/prisma/client'
import { dayBoundsJakarta, monthBoundsJakarta } from '../../shared/utils/jakarta-date'
import type { TransactionInput, TransactionListFilters } from '../../shared/types/transaction'

type ValidationResult =
  | { ok: true, value: TransactionInput }
  | { ok: false, error: string }

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function parseDate(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value
  }

  if (typeof value !== 'string' || !value.trim()) {
    return null
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return parsed
}

function parseAmount(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return null
}

function parseType(value: unknown): TransactionType | null {
  if (value === TransactionType.INCOME || value === TransactionType.OUTCOME) {
    return value
  }

  return null
}

function parseDescription(value: unknown): string | null {
  if (value === undefined || value === null || value === '') {
    return null
  }

  if (typeof value !== 'string') {
    return null
  }

  return value.trim() || null
}

export function validateTransactionBody(body: unknown): ValidationResult {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Request body must be a JSON object.' }
  }

  const input = body as Record<string, unknown>

  const type = parseType(input.type)
  if (!type) {
    return { ok: false, error: 'type is required and must be INCOME or OUTCOME.' }
  }

  const date = parseDate(input.date)
  if (!date) {
    return { ok: false, error: 'date is required and must be a valid ISO date string.' }
  }

  if (!isNonEmptyString(input.source)) {
    return { ok: false, error: 'source is required.' }
  }

  const amount = parseAmount(input.amount)
  if (amount === null) {
    return { ok: false, error: 'amount is required and must be a number.' }
  }

  if (amount <= 0) {
    return { ok: false, error: 'amount must be greater than 0.' }
  }

  if (!isNonEmptyString(input.title)) {
    return { ok: false, error: 'title is required.' }
  }

  if (!isNonEmptyString(input.category)) {
    return { ok: false, error: 'category is required.' }
  }

  const description = parseDescription(input.description)
  if (input.description !== undefined && input.description !== null && description === null && input.description !== '') {
    return { ok: false, error: 'description must be a string when provided.' }
  }

  return {
    ok: true,
    value: {
      type,
      date,
      source: input.source.trim(),
      amount,
      title: input.title.trim(),
      category: input.category.trim(),
      description,
    },
  }
}

type ListQueryResult =
  | { ok: true, filters: TransactionListFilters }
  | { ok: false, error: string }

function parsePositiveInt(value: unknown): number | null {
  if (typeof value === 'number' && Number.isInteger(value) && value > 0) {
    return value
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number.parseInt(value, 10)
    if (Number.isInteger(parsed) && parsed > 0) {
      return parsed
    }
  }

  return null
}

export function validateTransactionListQuery(query: Record<string, unknown>): ListQueryResult {
  const filters: TransactionListFilters = {}

  if (query.type !== undefined) {
    const type = parseType(query.type)
    if (!type) {
      return { ok: false, error: 'type must be INCOME or OUTCOME.' }
    }
    filters.type = type
  }

  if (query.source !== undefined) {
    if (!isNonEmptyString(query.source)) {
      return { ok: false, error: 'source must be a non-empty string.' }
    }
    filters.source = query.source.trim()
  }

  if (query.date !== undefined) {
    if (typeof query.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(query.date.trim())) {
      return { ok: false, error: 'date must be a valid YYYY-MM-DD string.' }
    }
    filters.date = query.date.trim()
  }

  const hasMonth = query.month !== undefined
  const hasYear = query.year !== undefined

  if (hasMonth) {
    const month = parsePositiveInt(query.month)
    if (month === null || month > 12) {
      return { ok: false, error: 'month must be an integer between 1 and 12.' }
    }

    if (!hasYear) {
      return { ok: false, error: 'year is required when month is provided.' }
    }

    filters.month = month
  }

  if (hasYear) {
    const year = parsePositiveInt(query.year)
    if (year === null || year < 1900 || year > 9999) {
      return { ok: false, error: 'year must be a valid integer between 1900 and 9999.' }
    }
    filters.year = year
  }

  return { ok: true, filters }
}

export function buildTransactionWhereClause(
  userId: string,
  filters: { type?: TransactionType, month?: number, year?: number, date?: string, source?: string },
) {
  const where: {
    userId: string
    type?: TransactionType
    source?: { name: string }
    date?: { gte: Date, lte: Date }
  } = {
    userId,
  }

  if (filters.type) {
    where.type = filters.type
  }

  if (filters.source) {
    where.source = { name: filters.source }
  }

  if (filters.date) {
    const bounds = dayBoundsJakarta(filters.date)
    if (bounds) {
      where.date = { gte: bounds.from, lte: bounds.to }
    }
  }
  else if (filters.year && filters.month) {
    const { from, to } = monthBoundsJakarta(filters.year, filters.month)
    where.date = { gte: from, lte: to }
  }
  else if (filters.year) {
    const { from } = monthBoundsJakarta(filters.year, 1)
    const { to } = monthBoundsJakarta(filters.year, 12)
    where.date = { gte: from, lte: to }
  }

  return where
}
