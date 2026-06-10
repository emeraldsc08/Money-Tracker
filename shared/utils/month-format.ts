import { JAKARTA_TIMEZONE, jakartaInstant } from './jakarta-date'

export function formatMonthLabel(year: number, month: number): string {
  const date = jakartaInstant(year, month, 15, 12, 0)
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: JAKARTA_TIMEZONE,
    month: 'long',
    year: 'numeric',
  }).format(date)
}
