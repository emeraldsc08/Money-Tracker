import type { ApiResponse } from '~~/shared/types/api'
import type { SerializedSource } from '~~/shared/types/master'

export function useTransactionSources() {
  const { data, refresh, status } = useFetch('/api/sources', {
    key: 'user-sources',
    transform: (response: ApiResponse<SerializedSource[]>) => {
      if (!response.success) {
        throw new Error(response.error ?? 'Failed to fetch sources.')
      }
      return response.data ?? []
    },
  })

  const sources = computed(() => (data.value ?? []).map(item => item.name))

  function hasSource(name: string): boolean {
    const normalized = name.trim().toLowerCase()
    return sources.value.some(source => source.toLowerCase() === normalized)
  }

  function isCustomSource(name: string): boolean {
    const item = data.value?.find(source => source.name === name)
    return item ? !item.isSystem : false
  }

  async function initSources() {
    await refresh()
  }

  async function addSource(name: string) {
    const trimmed = name.trim()
    if (!trimmed || hasSource(trimmed)) {
      return
    }

    await $fetch('/api/sources', {
      method: 'POST',
      body: { name: trimmed },
    })
    await refresh()
  }

  async function removeSource(name: string) {
    await $fetch(`/api/sources/${encodeURIComponent(name)}`, {
      method: 'DELETE',
      ignoreResponseError: true,
    })
    await refresh()
  }

  return {
    sources,
    addSource,
    removeSource,
    isCustomSource,
    initSources,
    status,
  }
}
