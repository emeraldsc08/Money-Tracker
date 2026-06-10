import { apiSuccess } from '../../utils/api-response'

export default defineEventHandler(async (event) => {
  await clearUserSession(event)
  return apiSuccess(null)
})
