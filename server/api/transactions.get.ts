import { apiError, apiSuccess } from '../utils/api-response'
import { requireUser } from '../utils/require-user'
import { transactionInclude } from '../utils/transaction-query'
import { serializeTransactions } from '../utils/transaction-serializer'
import {
  buildTransactionWhereClause,
  validateTransactionListQuery,
} from '../utils/transaction-validation'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireUser(event)
    const query = getQuery(event)
    const validation = validateTransactionListQuery(query)

    if (!validation.ok) {
      return apiError(event, validation.error, 400)
    }

    const transactions = await prisma.transaction.findMany({
      where: buildTransactionWhereClause(user.id, validation.filters),
      include: transactionInclude,
      orderBy: { date: 'desc' },
    })

    return apiSuccess(serializeTransactions(transactions))
  }
  catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
      return apiError(event, 'Unauthorized', 401)
    }

    console.error('[GET /api/transactions]', error)
    return apiError(event, 'Failed to fetch transactions.', 500)
  }
})
