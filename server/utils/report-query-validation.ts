function parseIsoDate(value: unknown): Date | null {
  if (typeof value !== 'string' || !value.trim()) {
    return null
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return parsed
}

type ReportQueryResult =
  | { ok: true, from: Date, to: Date }
  | { ok: false, error: string }

export function validateRealtimeReportQuery(query: Record<string, unknown>): ReportQueryResult {
  const from = parseIsoDate(query.from)
  const to = parseIsoDate(query.to)

  if (!from) {
    return { ok: false, error: 'from is required and must be a valid ISO date string.' }
  }

  if (!to) {
    return { ok: false, error: 'to is required and must be a valid ISO date string.' }
  }

  if (from.getTime() > to.getTime()) {
    return { ok: false, error: 'from must be earlier than or equal to to.' }
  }

  return { ok: true, from, to }
}
