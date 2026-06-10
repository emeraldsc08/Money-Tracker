import type { Transaction } from '../../generated/prisma/client'
import type { SerializedTransaction } from '../../shared/types/transaction'

export function serializeTransaction(transaction: Transaction): SerializedTransaction {
  return {
    id: transaction.id,
    type: transaction.type,
    date: transaction.date.toISOString(),
    source: transaction.source,
    amount: Number(transaction.amount),
    title: transaction.title,
    category: transaction.category,
    description: transaction.description,
    createdAt: transaction.createdAt.toISOString(),
    updatedAt: transaction.updatedAt.toISOString(),
  }
}

export function serializeTransactions(transactions: Transaction[]): SerializedTransaction[] {
  return transactions.map(serializeTransaction)
}
