import type { TransactionType } from '../../generated/prisma/client'

export async function resolveSourceIdForUser(userId: string, sourceName: string) {
  const source = await prisma.source.findUnique({
    where: {
      userId_name: {
        userId,
        name: sourceName,
      },
    },
  })

  return source?.id ?? null
}

export async function resolveCategoryIdForUser(
  userId: string,
  type: TransactionType,
  categoryName: string,
) {
  const category = await prisma.category.findUnique({
    where: {
      userId_type_name: {
        userId,
        type,
        name: categoryName,
      },
    },
  })

  return category?.id ?? null
}
