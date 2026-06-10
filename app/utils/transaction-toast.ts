export const TRANSACTION_TOAST_MESSAGES = {
  created: 'Transaksi berhasil ditambahkan.',
  updated: 'Transaksi berhasil diperbarui.',
  deleted: 'Transaksi berhasil dihapus.',
} as const

export type TransactionToastKey = keyof typeof TRANSACTION_TOAST_MESSAGES

export function isTransactionToastKey(value: unknown): value is TransactionToastKey {
  return typeof value === 'string' && value in TRANSACTION_TOAST_MESSAGES
}
