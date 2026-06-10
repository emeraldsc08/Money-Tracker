import type { TransactionType } from '../../generated/prisma/client'
import type { TransactionInput } from '../../shared/types/transaction'
import { resolveCategoryIdForUser, resolveSourceIdForUser } from './master-resolution'

type ResolveResult =
  | { ok: true, sourceId: string, categoryId: string }
  | { ok: false, error: string }

export async function resolveTransactionMasterIds(
  userId: string,
  input: TransactionInput,
): Promise<ResolveResult> {
  const sourceId = await resolveSourceIdForUser(userId, input.source)
  if (!sourceId) {
    return { ok: false, error: 'Sumber dana tidak ditemukan.' }
  }

  const categoryId = await resolveCategoryIdForUser(userId, input.type as TransactionType, input.category)
  if (!categoryId) {
    return { ok: false, error: 'Kategori tidak ditemukan.' }
  }

  return { ok: true, sourceId, categoryId }
}
