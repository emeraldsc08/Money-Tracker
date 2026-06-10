import { apiError, apiSuccess } from '../../utils/api-response'
import { requireUser } from '../../utils/require-user'
import { resolveTransactionMasterIds } from '../../utils/transaction-create'
import { transactionInclude } from '../../utils/transaction-query'
import { serializeTransaction } from '../../utils/transaction-serializer'
import { validateTransactionBody } from '../../utils/transaction-validation'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireUser(event)
    const id = getRouterParam(event, 'id')

    if (!id?.trim()) {
      return apiError(event, 'Transaction id is required.', 400)
    }

    const existing = await prisma.transaction.findFirst({
      where: { id, userId: user.id },
    })

    if (!existing) {
      return apiError(event, 'Transaction not found.', 404)
    }

    const body = await readBody(event)
    const validation = validateTransactionBody(body)

    if (!validation.ok) {
      return apiError(event, validation.error, 400)
    }

    const resolved = await resolveTransactionMasterIds(user.id, validation.value)
    if (!resolved.ok) {
      return apiError(event, resolved.error, 400)
    }

    const { type, date, amount, title, description } = validation.value

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        type,
        date,
        sourceId: resolved.sourceId,
        categoryId: resolved.categoryId,
        amount,
        title,
        description,
      },
      include: transactionInclude,
    })

    return apiSuccess(serializeTransaction(transaction))
  }
  catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
      return apiError(event, 'Unauthorized', 401)
    }

    console.error('[PUT /api/transactions/:id]', error)
    return apiError(event, 'Failed to update transaction.', 500)
  }
})
