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

    const transaction = await prisma.transaction.findFirst({
      where: { id, userId: user.id },
      include: transactionInclude,
    })

    if (!transaction) {
      return apiError(event, 'Transaction not found.', 404)
    }

    return apiSuccess(serializeTransaction(transaction))
  }
  catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
      return apiError(event, 'Unauthorized', 401)
    }

    console.error('[GET /api/transactions/:id]', error)
    return apiError(event, 'Failed to fetch transaction.', 500)
  }
})
