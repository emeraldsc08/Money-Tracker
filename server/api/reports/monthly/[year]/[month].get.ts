import { apiError, apiSuccess } from '../../../../utils/api-response'
import { buildMonthlyDetailReport } from '../../../../utils/monthly-report'
import { validateMonthParams } from '../../../../utils/monthly-query-validation'
import { requireUser } from '../../../../utils/require-user'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireUser(event)
    const year = getRouterParam(event, 'year')
    const month = getRouterParam(event, 'month')
    const validation = validateMonthParams(year, month)

    if (!validation.ok) {
      return apiError(event, validation.error, 400)
    }

    const report = await buildMonthlyDetailReport(user.id, validation.year, validation.month)
    return apiSuccess(report)
  }
  catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
      return apiError(event, 'Unauthorized', 401)
    }

    console.error('[GET /api/reports/monthly/:year/:month]', error)
    return apiError(event, 'Failed to fetch monthly report detail.', 500)
  }
})
