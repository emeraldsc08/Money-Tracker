import { apiError, apiSuccess } from '../../utils/api-response'
import { requireUser } from '../../utils/require-user'
import { transactionInclude } from '../../utils/transaction-query'
import { serializeTransaction } from '../../utils/transaction-serializer'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireUser(event)
    const id = getRouterParam(event, 'id')

    if (!id?.trim()) {
      return apiError(event, 'Transaction id is required.', 400)
    }

    const existing = await prisma.transaction.findFirst({
      where: { id, userId: user.id },
      include: transactionInclude,
    })

    if (!existing) {
      return apiError(event, 'Transaction not found.', 404)
    }

    await prisma.transaction.delete({
      where: { id },
    })

    return apiSuccess(serializeTransaction(existing))
  }
  catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
      return apiError(event, 'Unauthorized', 401)
    }

    console.error('[DELETE /api/transactions/:id]', error)
    return apiError(event, 'Failed to delete transaction.', 500)
  }
})
