import { TransactionType } from '../../../generated/prisma/client'
import { apiError, apiSuccess } from '../../utils/api-response'
import { serializeCategory } from '../../utils/master-serializer'
import { requireUser } from '../../utils/require-user'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireUser(event)
    const body = await readBody(event)

    if (!body || typeof body !== 'object') {
      return apiError(event, 'Invalid request body.', 400)
    }

    const input = body as { name?: unknown, type?: unknown }
    const name = typeof input.name === 'string' ? input.name.trim() : ''
    const type = input.type

    if (!name) {
      return apiError(event, 'Category name is required.', 400)
    }

    if (type !== TransactionType.INCOME && type !== TransactionType.OUTCOME) {
      return apiError(event, 'type must be INCOME or OUTCOME.', 400)
    }

    const existing = await prisma.category.findUnique({
      where: {
        userId_type_name: {
          userId: user.id,
          type,
          name,
        },
      },
    })

    if (existing) {
      return apiSuccess(serializeCategory(existing))
    }

    const category = await prisma.category.create({
      data: {
        userId: user.id,
        type,
        name,
        isSystem: false,
      },
    })

    setResponseStatus(event, 201)
    return apiSuccess(serializeCategory(category))
  }
  catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
      return apiError(event, 'Unauthorized', 401)
    }

    console.error('[POST /api/categories]', error)
    return apiError(event, 'Failed to add category.', 500)
  }
})
