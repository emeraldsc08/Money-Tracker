import { apiError, apiSuccess } from '../../utils/api-response'
import { serializeTransaction } from '../../utils/transaction-serializer'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id?.trim()) {
      return apiError(event, 'Transaction id is required.', 400)
    }

    const existing = await prisma.transaction.findUnique({
      where: { id },
    })

    if (!existing) {
      return apiError(event, 'Transaction not found.', 404)
    }

    const transaction = await prisma.transaction.delete({
      where: { id },
    })

    return apiSuccess(serializeTransaction(transaction))
  }
  catch (error) {
    console.error('[DELETE /api/transactions/:id]', error)
    return apiError(event, 'Failed to delete transaction.', 500)
  }
})
