import type { SerializedTransaction } from '~~/shared/types/transaction'
import { datetimeLocalToIso, toDatetimeLocalValue } from '~/utils/format'

export interface TransactionFormState {
  type: 'INCOME' | 'OUTCOME'
  date: string
  source: string
  title: string
  category: string
  amount: string
  description: string
}

export function createEmptyFormState(): TransactionFormState {
  return createEmptyFormStateForType('OUTCOME')
}

export function createEmptyFormStateForType(type: TransactionFormState['type']): TransactionFormState {
  const now = new Date()
  const localValue = toDatetimeLocalValue(now.toISOString())

  return {
    type,
    date: localValue,
    source: 'Cash',
    title: '',
    category: '',
    amount: '',
    description: '',
  }
}

export function formStateFromTransaction(transaction: SerializedTransaction): TransactionFormState {
  return {
    type: transaction.type,
    date: toDatetimeLocalValue(transaction.date),
    source: transaction.source,
    title: transaction.title,
    category: transaction.category,
    amount: String(transaction.amount),
    description: transaction.description ?? '',
  }
}

export function formStateToPayload(form: TransactionFormState) {
  const amount = Number(form.amount)
  const date = datetimeLocalToIso(form.date)

  if (!date) {
    throw new Error('Invalid date value.')
  }

  return {
    type: form.type,
    date,
    source: form.source.trim(),
    title: form.title.trim(),
    category: form.category.trim(),
    amount,
    description: form.description.trim() || null,
  }
}

export function validateTransactionFormClient(form: TransactionFormState): string | null {
  if (!form.date.trim()) {
    return 'Date and time are required.'
  }

  const isoDate = datetimeLocalToIso(form.date)
  if (!isoDate) {
    return 'Date and time are invalid.'
  }

  const parsedDate = new Date(isoDate)
  if (Number.isNaN(parsedDate.getTime())) {
    return 'Date and time are invalid.'
  }

  if (!form.source.trim()) {
    return 'Source is required.'
  }

  const amount = Number(form.amount)
  if (!form.amount || !Number.isFinite(amount)) {
    return 'Amount is required.'
  }

  if (amount <= 0) {
    return 'Amount must be greater than 0.'
  }

  if (!form.title.trim()) {
    return 'Title is required.'
  }

  if (!form.category.trim()) {
    return 'Category is required.'
  }

  return null
}
