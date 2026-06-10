import { apiError, apiSuccess } from '../../utils/api-response'
import { requireUser } from '../../utils/require-user'
import { validateRealtimeReportQuery } from '../../utils/report-query-validation'
import { buildRealtimeReport } from '../../utils/realtime-report'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireUser(event)
    const query = getQuery(event)
    const validation = validateRealtimeReportQuery(query)

    if (!validation.ok) {
      return apiError(event, validation.error, 400)
    }

    const report = await buildRealtimeReport(user.id, validation.from, validation.to)
    return apiSuccess(report)
  }
  catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 401) {
      return apiError(event, 'Unauthorized', 401)
    }

    console.error('[GET /api/reports/realtime]', error)
    return apiError(event, 'Failed to fetch realtime report.', 500)
  }
})
