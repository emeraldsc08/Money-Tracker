import { apiError, apiSuccess } from '../../utils/api-response'
import { serializeSource } from '../../utils/master-serializer'
import { requireUser } from '../../utils/require-user'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireUser(event)
    const body = await readBody(event)

    if (!body || typeof body !== 'object' || typeof (body as { name?: unknown }).name !== 'string') {
      return apiError(event, 'Source name is required.', 400)
    }

    const name = (body as { name: string }).name.trim()
    if (!name) {
      return apiError(event, 'Source name is required.', 400)
    }

    const existing = await prisma.source.findUnique({
      where: {
        userId_name: {
          userId: user.id,
          name,
        },
      },
    })

    if (existing) {
      return apiSuccess(serializeSource(existing))
    }

    const maxSort = await prisma.source.aggregate({
      where: { userId: user.id },
      _max: { sortOrder: true },
    })

    const source = await prisma.source.create({
      data: {
        userId: user.id,
        name,
        sortOrder: (maxSort._max.sortOrder ?? -1) + 1,
        isSystem: false,
      },
    })

    setResponseStatus(event, 201)
    return apiSuccess(serializeSource(source))
  }
  catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
      return apiError(event, 'Unauthorized', 401)
    }

    console.error('[POST /api/sources]', error)
    return apiError(event, 'Failed to add source.', 500)
  }
})
