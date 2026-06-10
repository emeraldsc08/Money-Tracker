import { apiError, apiSuccess } from '../../utils/api-response'
import { requireUser } from '../../utils/require-user'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireUser(event)
    return apiSuccess(user)
  }
  catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
      return apiError(event, 'Unauthorized', 401)
    }

    console.error('[GET /api/auth/me]', error)
    return apiError(event, 'Gagal mengambil profil.', 500)
  }
})
