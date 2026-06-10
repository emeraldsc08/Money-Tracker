import type { ApiResponse } from '~~/shared/types/api'
import type { SerializedCategory } from '~~/shared/types/master'

type TransactionCategoryType = 'INCOME' | 'OUTCOME'

export function useTransactionCategories(type: TransactionCategoryType) {
  const { data, refresh, status } = useFetch('/api/categories', {
    key: () => `user-categories-${type}`,
    query: { type },
    transform: (response: ApiResponse<SerializedCategory[]>) => {
      if (!response.success) {
        throw new Error(response.error ?? 'Gagal mengambil kategori.')
      }
      return response.data ?? []
    },
  })

  const categories = computed(() => (data.value ?? []).map(item => item.name))

  function hasCategory(name: string): boolean {
    const normalized = name.trim().toLowerCase()
    return categories.value.some(category => category.toLowerCase() === normalized)
  }

  function isCustomCategory(name: string): boolean {
    const item = data.value?.find(category => category.name === name)
    return item ? !item.isSystem : false
  }

  async function initCategories() {
    await refresh()
  }

  async function addCategory(name: string) {
    const trimmed = name.trim()
    if (!trimmed || hasCategory(trimmed)) {
      return
    }

    await $fetch('/api/categories', {
      method: 'POST',
      body: { name: trimmed, type },
    })
    await refresh()
  }

  async function removeCategory(name: string) {
    await $fetch(`/api/categories/${encodeURIComponent(name)}?type=${type}`, {
      method: 'DELETE',
      ignoreResponseError: true,
    })
    await refresh()
  }

  return {
    categories,
    addCategory,
    removeCategory,
    isCustomCategory,
    initCategories,
    status,
  }
}
