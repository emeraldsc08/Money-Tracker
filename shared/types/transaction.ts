import type { TransactionType } from '../../generated/prisma/client'

export interface SerializedTransaction {
  id: string
  type: TransactionType
  date: string
  source: string
  amount: number
  title: string
  category: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface TransactionListFilters {
  type?: TransactionType
  month?: number
  year?: number
  date?: string
  source?: string
}

export interface TransactionInput {
  type: TransactionType
  date: Date
  source: string
  amount: number
  title: string
  category: string
  description: string | null
}
