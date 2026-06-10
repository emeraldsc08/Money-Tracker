export const JAKARTA_TIMEZONE = 'Asia/Jakarta'

const JAKARTA_OFFSET_MS = 7 * 60 * 60 * 1000

const WEEKDAY_TO_INDEX: Record<string, number> = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
}

export interface JakartaYmd {
  year: number
  month: number
  day: number
}

export function getJakartaYmd(date: Date): JakartaYmd {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: JAKARTA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  const lookup = Object.fromEntries(
    parts.filter(part => part.type !== 'literal').map(part => [part.type, part.value]),
  )

  return {
    year: Number(lookup.year),
    month: Number(lookup.month),
    day: Number(lookup.day),
  }
}

export function jakartaInstant(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
  millisecond = 0,
): Date {
  return new Date(
    Date.UTC(year, month - 1, day, hour, minute, second, millisecond) - JAKARTA_OFFSET_MS,
  )
}

export function startOfDayJakarta(date: Date): Date {
  const { year, month, day } = getJakartaYmd(date)
  return jakartaInstant(year, month, day, 0, 0, 0, 0)
}

export function endOfDayJakarta(date: Date): Date {
  const { year, month, day } = getJakartaYmd(date)
  return jakartaInstant(year, month, day, 23, 59, 59, 999)
}

export function getJakartaWeekdayIndex(date: Date): number {
  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone: JAKARTA_TIMEZONE,
    weekday: 'long',
  }).format(date)

  return WEEKDAY_TO_INDEX[weekday] ?? 0
}

export function startOfWeekJakarta(date: Date): Date {
  const { year, month, day } = getJakartaYmd(date)
  const weekdayIndex = getJakartaWeekdayIndex(date)
  const monday = new Date(Date.UTC(year, month - 1, day))
  monday.setUTCDate(monday.getUTCDate() - weekdayIndex)

  return jakartaInstant(
    monday.getUTCFullYear(),
    monday.getUTCMonth() + 1,
    monday.getUTCDate(),
    0,
    0,
    0,
    0,
  )
}

export function endOfWeekJakarta(date: Date): Date {
  const startYmd = getJakartaYmd(startOfWeekJakarta(date))
  const sunday = new Date(Date.UTC(startYmd.year, startYmd.month - 1, startYmd.day))
  sunday.setUTCDate(sunday.getUTCDate() + 6)

  return jakartaInstant(
    sunday.getUTCFullYear(),
    sunday.getUTCMonth() + 1,
    sunday.getUTCDate(),
    23,
    59,
    59,
    999,
  )
}

export function startOfMonthJakarta(date: Date): Date {
  const { year, month } = getJakartaYmd(date)
  return jakartaInstant(year, month, 1, 0, 0, 0, 0)
}

export function endOfMonthJakarta(date: Date): Date {
  const { year, month } = getJakartaYmd(date)
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate()
  return jakartaInstant(year, month, lastDay, 23, 59, 59, 999)
}

export function formatJakartaDateString(ymd: JakartaYmd): string {
  return `${ymd.year}-${String(ymd.month).padStart(2, '0')}-${String(ymd.day).padStart(2, '0')}`
}

export function getTodayJakartaDateString(): string {
  return formatJakartaDateString(getJakartaYmd(new Date()))
}

export function dayBoundsJakarta(dateStr: string): { from: Date, to: Date } | null {
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) {
    return null
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return null
  }

  return {
    from: jakartaInstant(year, month, day, 0, 0, 0, 0),
    to: jakartaInstant(year, month, day, 23, 59, 59, 999),
  }
}

export function addDaysToDateString(dateStr: string, days: number): string | null {
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) {
    return null
  }

  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])))
  date.setUTCDate(date.getUTCDate() + days)

  return formatJakartaDateString({
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  })
}

export function monthBoundsJakarta(year: number, month: number): { from: Date, to: Date } {
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate()

  return {
    from: jakartaInstant(year, month, 1, 0, 0, 0, 0),
    to: jakartaInstant(year, month, lastDay, 23, 59, 59, 999),
  }
}

export function parseDateInputToRange(fromValue: string, toValue: string): { from: Date, to: Date } | null {
  const fromMatch = fromValue.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  const toMatch = toValue.match(/^(\d{4})-(\d{2})-(\d{2})$/)

  if (!fromMatch || !toMatch) {
    return null
  }

  const from = jakartaInstant(
    Number(fromMatch[1]),
    Number(fromMatch[2]),
    Number(fromMatch[3]),
    0,
    0,
    0,
    0,
  )
  const to = jakartaInstant(
    Number(toMatch[1]),
    Number(toMatch[2]),
    Number(toMatch[3]),
    23,
    59,
    59,
    999,
  )

  if (from.getTime() > to.getTime()) {
    return null
  }

  return { from, to }
}
