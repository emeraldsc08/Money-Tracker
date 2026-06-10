import { apiError, apiSuccess } from '../../utils/api-response'
import { validateRealtimeReportQuery } from '../../utils/report-query-validation'
import { buildRealtimeReport } from '../../utils/realtime-report'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const validation = validateRealtimeReportQuery(query)

    if (!validation.ok) {
      return apiError(event, validation.error, 400)
    }

    const report = await buildRealtimeReport(validation.from, validation.to)
    return apiSuccess(report)
  }
  catch (error) {
    console.error('[GET /api/reports/realtime]', error)
    return apiError(event, 'Failed to fetch realtime report.', 500)
  }
})
