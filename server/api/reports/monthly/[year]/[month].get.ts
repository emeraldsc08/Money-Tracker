import { apiError, apiSuccess } from '../../../../utils/api-response'
import { buildMonthlyDetailReport } from '../../../../utils/monthly-report'
import { validateMonthParams } from '../../../../utils/monthly-query-validation'

export default defineEventHandler(async (event) => {
  try {
    const year = getRouterParam(event, 'year')
    const month = getRouterParam(event, 'month')
    const validation = validateMonthParams(year, month)

    if (!validation.ok) {
      return apiError(event, validation.error, 400)
    }

    const report = await buildMonthlyDetailReport(validation.year, validation.month)
    return apiSuccess(report)
  }
  catch (error) {
    console.error('[GET /api/reports/monthly/:year/:month]', error)
    return apiError(event, 'Failed to fetch monthly report detail.', 500)
  }
})
