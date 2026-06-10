import { apiError, apiSuccess } from '../../utils/api-response'
import { buildMonthlyListReport } from '../../utils/monthly-report'

export default defineEventHandler(async (event) => {
  try {
    const months = await buildMonthlyListReport()
    return apiSuccess(months)
  }
  catch (error) {
    console.error('[GET /api/reports/monthly]', error)
    return apiError(event, 'Failed to fetch monthly report list.', 500)
  }
})
