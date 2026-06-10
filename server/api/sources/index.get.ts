import { apiError, apiSuccess } from '../../utils/api-response'
import { serializeSources } from '../../utils/master-serializer'
import { requireUser } from '../../utils/require-user'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireUser(event)

    const sources = await prisma.source.findMany({
      where: { userId: user.id },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    })

    return apiSuccess(serializeSources(sources))
  }
  catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
      return apiError(event, 'Unauthorized', 401)
    }

    console.error('[GET /api/sources]', error)
    return apiError(event, 'Gagal mengambil sumber dana.', 500)
  }
})
