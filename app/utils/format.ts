import {
  addDaysToDateString,
  getTodayJakartaDateString,
} from '~~/shared/utils/jakarta-date'

const JAKARTA_TIMEZONE = 'Asia/Jakarta'

export function formatRupiah(amount: number): string {
  const formatted = new Intl.NumberFormat('id-ID').format(amount)
  return `Rp ${formatted}`
}

export function formatSignedRupiah(amount: number, type: 'INCOME' | 'OUTCOME'): string {
  const formatted = formatRupiah(amount)
  return type === 'INCOME' ? `+${formatted}` : `-${formatted}`
}

export function parseAmountInput(value: string): string {
  return value.replace(/\D/g, '')
}

export function formatAmountInput(value: string): string {
  if (!value) {
    return ''
  }

  const amount = Number(value)
  if (!Number.isFinite(amount)) {
    return value
  }

  return new Intl.NumberFormat('id-ID').format(amount)
}

export function formatDayLabel(dateStr: string): string {
  const today = getTodayJakartaDateString()
  if (dateStr === today) {
    return 'Today'
  }

  const yesterday = addDaysToDateString(today, -1)
  if (dateStr === yesterday) {
    return 'Yesterday'
  }

  const [year, month, day] = dateStr.split('-').map(Number)
  if (!year || !month || !day) {
    return dateStr
  }

  const date = new Date(Date.UTC(year, month - 1, day, 12))
  return new Intl.DateTimeFormat('en-US', {
    timeZone: JAKARTA_TIMEZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function formatTransactionTime(isoDate: string): string {
  const date = new Date(isoDate)
  return new Intl.DateTimeFormat('en-US', {
    timeZone: JAKARTA_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function formatTransactionDate(isoDate: string): string {
  const date = new Date(isoDate)
  return new Intl.DateTimeFormat('en-US', {
    timeZone: JAKARTA_TIMEZONE,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function toDatetimeLocalValue(isoDate: string): string {
  const date = new Date(isoDate)
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: JAKARTA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date)

  const lookup = Object.fromEntries(
    parts.filter(part => part.type !== 'literal').map(part => [part.type, part.value]),
  )

  const pad = (value: string) => value.padStart(2, '0')

  return `${lookup.year ?? '1970'}-${lookup.month ?? '01'}-${lookup.day ?? '01'}T${pad(lookup.hour ?? '00')}:${pad(lookup.minute ?? '00')}`
}

export function datetimeLocalToIso(value: string): string | null {
  const [datePart, timePart] = value.split('T')
  if (!datePart || !timePart) {
    return null
  }

  const dateParts = datePart.split('-')
  const timeParts = timePart.split(':')

  if (dateParts.length !== 3 || timeParts.length < 2) {
    return null
  }

  const year = Number(dateParts[0])
  const month = Number(dateParts[1])
  const day = Number(dateParts[2])
  const hour = Number(timeParts[0])
  const minute = Number(timeParts[1])

  if (
    !Number.isFinite(year)
    || !Number.isFinite(month)
    || !Number.isFinite(day)
    || !Number.isFinite(hour)
    || !Number.isFinite(minute)
  ) {
    return null
  }

  const jakartaOffsetMinutes = 7 * 60
  const utcMs = Date.UTC(year, month - 1, day, hour, minute) - (jakartaOffsetMinutes * 60 * 1000)
  return new Date(utcMs).toISOString()
}
