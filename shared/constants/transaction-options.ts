export const DEFAULT_SOURCES = [
  'Cash',
  'BCA',
  'Mandiri',
  'BRI',
  'OVO',
  'GoPay',
] as const

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Other',
] as const

export const OUTCOME_CATEGORIES = [
  'Food',
  'Transport',
  'Bills',
  'Shopping',
  'Entertainment',
  'Other',
] as const

export type DefaultSource = (typeof DEFAULT_SOURCES)[number]
export type IncomeCategory = (typeof INCOME_CATEGORIES)[number]
export type OutcomeCategory = (typeof OUTCOME_CATEGORIES)[number]
