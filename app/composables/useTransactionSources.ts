import { DEFAULT_SOURCES } from '~~/shared/constants/transaction-options'

const STORAGE_KEY = 'money-tracker-custom-sources'

function readStoredSources(): string[] {
  if (!import.meta.client) {
    return []
  }

  const stored = localStorage.getItem(STORAGE_KEY)
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

function writeStoredSources(sources: string[]) {
  if (!import.meta.client) {
    return
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(sources))
}

export function useTransactionSources() {
  const defaultSources = [...DEFAULT_SOURCES]
  const customSources = useState<string[]>('custom-sources', () => [])

  const sources = computed(() => [...defaultSources, ...customSources.value])

  function initSources() {
    customSources.value = readStoredSources()
  }

  function hasSource(name: string): boolean {
    const normalized = name.trim().toLowerCase()
    return sources.value.some(source => source.toLowerCase() === normalized)
  }

  function addSource(name: string) {
    const trimmed = name.trim()
    if (!trimmed || hasSource(trimmed)) {
      return
    }

    customSources.value = [...customSources.value, trimmed]
    writeStoredSources(customSources.value)
  }

  function removeSource(name: string) {
    customSources.value = customSources.value.filter(source => source !== name)
    writeStoredSources(customSources.value)
  }

  function isCustomSource(name: string): boolean {
    return customSources.value.includes(name)
  }

  if (import.meta.client) {
    initSources()
  }

  return {
    sources,
    addSource,
    removeSource,
    isCustomSource,
    initSources,
  }
}
