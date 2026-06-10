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
    source: 'Uang Tunai',
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
    return 'Tanggal & jam wajib diisi.'
  }

  const isoDate = datetimeLocalToIso(form.date)
  if (!isoDate) {
    return 'Tanggal & jam tidak valid.'
  }

  const parsedDate = new Date(isoDate)
  if (Number.isNaN(parsedDate.getTime())) {
    return 'Tanggal & jam tidak valid.'
  }

  if (!form.source.trim()) {
    return 'Jenis sumber wajib dipilih.'
  }

  const amount = Number(form.amount)
  if (!form.amount || !Number.isFinite(amount)) {
    return 'Amount wajib diisi.'
  }

  if (amount <= 0) {
    return 'Amount harus lebih dari 0.'
  }

  if (!form.title.trim()) {
    return 'Title wajib diisi.'
  }

  if (!form.category.trim()) {
    return 'Category wajib dipilih.'
  }

  return null
}
