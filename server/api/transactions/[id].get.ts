import { apiError, apiSuccess } from '../../utils/api-response'
import { serializeTransaction } from '../../utils/transaction-serializer'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id?.trim()) {
      return apiError(event, 'Transaction id is required.', 400)
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id },
    })

    if (!transaction) {
      return apiError(event, 'Transaction not found.', 404)
    }

    return apiSuccess(serializeTransaction(transaction))
  }
  catch (error) {
    console.error('[GET /api/transactions/:id]', error)
    return apiError(event, 'Failed to fetch transaction.', 500)
  }
})
