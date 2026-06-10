import { TransactionType } from '../../../generated/prisma/client'
import { apiError, apiSuccess } from '../../utils/api-response'
import { requireUser } from '../../utils/require-user'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireUser(event)
    const name = decodeURIComponent(getRouterParam(event, 'name') ?? '').trim()
    const query = getQuery(event)
    const type = query.type

    if (!name) {
      return apiError(event, 'Nama kategori wajib diisi.', 400)
    }

    if (type !== TransactionType.INCOME && type !== TransactionType.OUTCOME) {
      return apiError(event, 'type must be INCOME or OUTCOME.', 400)
    }

    const category = await prisma.category.findUnique({
      where: {
        userId_type_name: {
          userId: user.id,
          type,
          name,
        },
      },
    })

    if (!category) {
      return apiError(event, 'Kategori tidak ditemukan.', 404)
    }

    if (category.isSystem) {
      return apiError(event, 'Kategori bawaan tidak bisa dihapus.', 400)
    }

    const usageCount = await prisma.transaction.count({
      where: { categoryId: category.id, userId: user.id },
    })

    if (usageCount > 0) {
      return apiError(event, 'Kategori masih dipakai transaksi.', 400)
    }

    await prisma.category.delete({
      where: { id: category.id },
    })

    return apiSuccess(null)
  }
  catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
      return apiError(event, 'Unauthorized', 401)
    }

    console.error('[DELETE /api/categories/:name]', error)
    return apiError(event, 'Gagal menghapus kategori.', 500)
  }
})
