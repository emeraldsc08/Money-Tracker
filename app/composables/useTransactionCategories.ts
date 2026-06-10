import {
  INCOME_CATEGORIES,
  OUTCOME_CATEGORIES,
} from '~~/shared/constants/transaction-options'

type TransactionCategoryType = 'INCOME' | 'OUTCOME'

const STORAGE_KEYS: Record<TransactionCategoryType, string> = {
  INCOME: 'money-tracker-custom-categories-income',
  OUTCOME: 'money-tracker-custom-categories-outcome',
}

function readStoredCategories(type: TransactionCategoryType): string[] {
  if (!import.meta.client) {
    return []
  }

  const stored = localStorage.getItem(STORAGE_KEYS[type])
  if (!stored) {
    return []
  }

  try {
    const parsed: unknown = JSON.parse(stored)
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .filter((item): item is string => typeof item === 'string')
      .map(item => item.trim())
      .filter(Boolean)
  }
  catch {
    return []
  }
}

function writeStoredCategories(type: TransactionCategoryType, categories: string[]) {
  if (!import.meta.client) {
    return
  }

  localStorage.setItem(STORAGE_KEYS[type], JSON.stringify(categories))
}

export function useTransactionCategories(type: TransactionCategoryType) {
  const defaultCategories = type === 'INCOME'
    ? [...INCOME_CATEGORIES]
    : [...OUTCOME_CATEGORIES]

  const customCategories = useState<string[]>(`custom-categories-${type}`, () => [])

  const categories = computed(() => [...defaultCategories, ...customCategories.value])

  function initCategories() {
    customCategories.value = readStoredCategories(type)
  }

  function hasCategory(name: string): boolean {
    const normalized = name.trim().toLowerCase()
    return categories.value.some(category => category.toLowerCase() === normalized)
  }

  function addCategory(name: string) {
    const trimmed = name.trim()
    if (!trimmed || hasCategory(trimmed)) {
      return
    }

    customCategories.value = [...customCategories.value, trimmed]
    writeStoredCategories(type, customCategories.value)
  }

  function removeCategory(name: string) {
    customCategories.value = customCategories.value.filter(category => category !== name)
    writeStoredCategories(type, customCategories.value)
  }

  function isCustomCategory(name: string): boolean {
    return customCategories.value.includes(name)
  }

  if (import.meta.client) {
    initCategories()
  }

  return {
    categories,
    addCategory,
    removeCategory,
    isCustomCategory,
    initCategories,
  }
}
