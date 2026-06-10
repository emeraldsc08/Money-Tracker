import type { ReportDateRange, ReportPeriodPreset } from '../types/report'
import {
  endOfDayJakarta,
  endOfMonthJakarta,
  endOfWeekJakarta,
  parseDateInputToRange,
  startOfDayJakarta,
  startOfMonthJakarta,
  startOfWeekJakarta,
} from './jakarta-date'

export function getPresetDateRange(preset: Exclude<ReportPeriodPreset, 'custom'>, reference = new Date()): ReportDateRange {
  let from: Date
  let to: Date

  switch (preset) {
    case 'today':
      from = startOfDayJakarta(reference)
      to = endOfDayJakarta(reference)
      break
    case 'week':
      from = startOfWeekJakarta(reference)
      to = endOfWeekJakarta(reference)
      break
    case 'month':
      from = startOfMonthJakarta(reference)
      to = endOfMonthJakarta(reference)
      break
  }

  return {
    from: from.toISOString(),
    to: to.toISOString(),
  }
}

export function getCustomDateRange(fromValue: string, toValue: string): ReportDateRange | null {
  const parsed = parseDateInputToRange(fromValue, toValue)
  if (!parsed) {
    return null
  }

  return {
    from: parsed.from.toISOString(),
    to: parsed.to.toISOString(),
  }
}
