import type { Category, Source, Transaction } from '../../generated/prisma/client'
import type { SerializedTransaction } from '../../shared/types/transaction'

export type TransactionWithRelations = Transaction & {
  source: Source
  category: Category
}

export function serializeTransaction(transaction: TransactionWithRelations): SerializedTransaction {
  return {
    id: transaction.id,
    type: transaction.type,
    date: transaction.date.toISOString(),
    source: transaction.source.name,
    amount: Number(transaction.amount),
    title: transaction.title,
    category: transaction.category.name,
    description: transaction.description,
    createdAt: transaction.createdAt.toISOString(),
    updatedAt: transaction.updatedAt.toISOString(),
  }
}

export function serializeTransactions(transactions: TransactionWithRelations[]): SerializedTransaction[] {
  return transactions.map(serializeTransaction)
}
