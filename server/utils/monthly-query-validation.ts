type MonthParamsResult =
  | { ok: true, year: number, month: number }
  | { ok: false, error: string }

function parsePositiveInt(value: unknown): number | null {
  if (typeof value === 'number' && Number.isInteger(value) && value > 0) {
    return value
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number.parseInt(value, 10)
    if (Number.isInteger(parsed) && parsed > 0) {
      return parsed
    }
  }

  return null
}

export function validateMonthParams(yearValue: unknown, monthValue: unknown): MonthParamsResult {
  const year = parsePositiveInt(yearValue)
  const month = parsePositiveInt(monthValue)

  if (year === null || year < 1900 || year > 9999) {
    return { ok: false, error: 'year must be a valid integer between 1900 and 9999.' }
  }

  if (month === null || month > 12) {
    return { ok: false, error: 'month must be an integer between 1 and 12.' }
  }

  return { ok: true, year, month }
}
