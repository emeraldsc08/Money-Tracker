export const TRANSACTION_TOAST_MESSAGES = {
  created: 'Transaction added successfully.',
  updated: 'Transaction updated successfully.',
  deleted: 'Transaction deleted successfully.',
} as const

export type TransactionToastKey = keyof typeof TRANSACTION_TOAST_MESSAGES

export function isTransactionToastKey(value: unknown): value is TransactionToastKey {
  return typeof value === 'string' && value in TRANSACTION_TOAST_MESSAGES
}
