import { TransactionType } from '../../../generated/prisma/client'
import { apiError, apiSuccess } from '../../utils/api-response'
import { serializeCategories } from '../../utils/master-serializer'
import { requireUser } from '../../utils/require-user'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireUser(event)
    const query = getQuery(event)

    const where: { userId: string, type?: TransactionType } = {
      userId: user.id,
    }

    if (query.type !== undefined) {
      if (query.type !== TransactionType.INCOME && query.type !== TransactionType.OUTCOME) {
        return apiError(event, 'type must be INCOME or OUTCOME.', 400)
      }
      where.type = query.type
    }

    const categories = await prisma.category.findMany({
      where,
      orderBy: [{ name: 'asc' }],
    })

    return apiSuccess(serializeCategories(categories))
  }
  catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
      return apiError(event, 'Unauthorized', 401)
    }

    console.error('[GET /api/categories]', error)
    return apiError(event, 'Failed to fetch categories.', 500)
  }
})
