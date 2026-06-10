import { apiError, apiSuccess } from '../../utils/api-response'
import { requireUser } from '../../utils/require-user'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireUser(event)
    const name = decodeURIComponent(getRouterParam(event, 'name') ?? '').trim()

    if (!name) {
      return apiError(event, 'Source name is required.', 400)
    }

    const source = await prisma.source.findUnique({
      where: {
        userId_name: {
          userId: user.id,
          name,
        },
      },
    })

    if (!source) {
      return apiError(event, 'Source not found.', 404)
    }

    if (source.isSystem) {
      return apiError(event, 'Default sources cannot be deleted.', 400)
    }

    const usageCount = await prisma.transaction.count({
      where: { sourceId: source.id, userId: user.id },
    })

    if (usageCount > 0) {
      return apiError(event, 'Source is still used by transactions.', 400)
    }

    await prisma.source.delete({
      where: { id: source.id },
    })

    return apiSuccess(null)
  }
  catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
      return apiError(event, 'Unauthorized', 401)
    }

    console.error('[DELETE /api/sources/:name]', error)
    return apiError(event, 'Failed to delete source.', 500)
  }
})
