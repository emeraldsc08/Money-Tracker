import { apiError, apiSuccess } from '../../utils/api-response'
import { serializeTransaction } from '../../utils/transaction-serializer'
import { validateTransactionBody } from '../../utils/transaction-validation'

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

    const body = await readBody(event)
    const validation = validateTransactionBody(body)

    if (!validation.ok) {
      return apiError(event, validation.error, 400)
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: validation.value,
    })

    return apiSuccess(serializeTransaction(transaction))
  }
  catch (error) {
    console.error('[PUT /api/transactions/:id]', error)
    return apiError(event, 'Failed to update transaction.', 500)
  }
})
