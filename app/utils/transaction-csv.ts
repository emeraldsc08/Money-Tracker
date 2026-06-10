import type { SerializedTransaction } from '~~/shared/types/transaction'

const JAKARTA_TIMEZONE = 'Asia/Jakarta'

const CSV_HEADERS = ['Date', 'Type', 'Title', 'Category', 'Source', 'Amount', 'Description'] as const

function escapeCsvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return ''
  }

  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`
  }

  return str
}

function formatTransactionDateForCsv(isoDate: string): string {
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

  return `${lookup.year}-${lookup.month}-${lookup.day} ${lookup.hour}:${lookup.minute}`
}

export function transactionsToCsv(transactions: SerializedTransaction[]): string {
  const rows = transactions.map((transaction) => {
    return [
      formatTransactionDateForCsv(transaction.date),
      transaction.type,
      transaction.title,
      transaction.category,
      transaction.source,
      transaction.amount,
      transaction.description ?? '',
    ].map(escapeCsvCell).join(',')
  })

  return [CSV_HEADERS.join(','), ...rows].join('\n')
}

export function buildMonthlyTransactionsCsvFilename(year: number, month: number): string {
  return `transactions-${year}-${String(month).padStart(2, '0')}.csv`
}

export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([`\uFEFF${content}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function exportTransactionsCsv(
  transactions: SerializedTransaction[],
  year: number,
  month: number,
): void {
  const filename = buildMonthlyTransactionsCsvFilename(year, month)
  const content = transactionsToCsv(transactions)
  downloadCsv(filename, content)
}
