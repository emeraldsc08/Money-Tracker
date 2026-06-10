export const DEFAULT_SOURCES = [
  'Uang Tunai',
  'BCA',
  'Mandiri',
  'BRI',
  'OVO',
  'GoPay',
] as const

export const INCOME_CATEGORIES = [
  'Gaji',
  'Freelance',
  'Investasi',
  'Lainnya',
] as const

export const OUTCOME_CATEGORIES = [
  'Makan',
  'Transport',
  'Tagihan',
  'Belanja',
  'Hiburan',
  'Lainnya',
] as const

export type DefaultSource = (typeof DEFAULT_SOURCES)[number]
export type IncomeCategory = (typeof INCOME_CATEGORIES)[number]
export type OutcomeCategory = (typeof OUTCOME_CATEGORIES)[number]
