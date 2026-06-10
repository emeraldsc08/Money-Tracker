import { apiError, apiSuccess } from '../utils/api-response'
import { serializeTransactions } from '../utils/transaction-serializer'
import {
  buildTransactionWhereClause,
  validateTransactionListQuery,
} from '../utils/transaction-validation'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const validation = validateTransactionListQuery(query)

    if (!validation.ok) {
      return apiError(event, validation.error, 400)
    }

    const transactions = await prisma.transaction.findMany({
      where: buildTransactionWhereClause(validation.filters),
      orderBy: { date: 'desc' },
    })

    return apiSuccess(serializeTransactions(transactions))
  }
  catch (error) {
    console.error('[GET /api/transactions]', error)
    return apiError(event, 'Failed to fetch transactions.', 500)
  }
})
