<script setup lang="ts">
import type { ApiResponse } from '~~/shared/types/api'
import type { SerializedTransaction } from '~~/shared/types/transaction'
import { formatDayLabel, formatRupiah } from '~/utils/format'
import { isTransactionToastKey, TRANSACTION_TOAST_MESSAGES } from '~/utils/transaction-toast'
import {
  buildTransactionFilterQuery,
  getDefaultTransactionDate,
  hasActiveTransactionFilters,
  parseTransactionFiltersFromQuery,
  type TransactionFilterState,
} from '~/utils/transaction-filters'

definePageMeta({
  middleware: 'transactions-default-date',
})

const route = useRoute()
const { showToast } = useToast()

const filters = computed(() => parseTransactionFiltersFromQuery(route.query))
const dayLabel = computed(() => formatDayLabel(filters.value.date))

const apiQuery = computed(() => buildTransactionFilterQuery(filters.value))

const { data: transactions, status, error, refresh } = await useFetch('/api/transactions', {
  key: () => `transactions-list-${JSON.stringify(apiQuery.value)}`,
  query: apiQuery,
  transform: (response: ApiResponse<SerializedTransaction[]>) => {
    if (!response.success) {
      throw new Error(response.error ?? 'Failed to fetch transactions.')
    }
    return response.data ?? []
  },
})

const isLoading = computed(() => status.value === 'pending')
const hasTransactions = computed(() => (transactions.value?.length ?? 0) > 0)
const fetchErrorMessage = computed(() => error.value?.message ?? null)
const isFiltered = computed(() => hasActiveTransactionFilters(filters.value))

const dailySummary = computed(() => {
  const items = transactions.value ?? []
  const income = items
    .filter(item => item.type === 'INCOME')
    .reduce((sum, item) => sum + item.amount, 0)
  const outcome = items
    .filter(item => item.type === 'OUTCOME')
    .reduce((sum, item) => sum + item.amount, 0)

  return {
    income,
    outcome,
    balance: income - outcome,
    count: items.length,
  }
})

function applyFilters(nextFilters: TransactionFilterState) {
  navigateTo({
    path: '/transactions',
    query: buildTransactionFilterQuery(nextFilters),
  })
}

function resetFilters() {
  navigateTo({
    path: '/transactions',
    query: { date: getDefaultTransactionDate() },
  })
}

onMounted(() => {
  const toastKey = route.query.toast
  if (isTransactionToastKey(toastKey)) {
    showToast(TRANSACTION_TOAST_MESSAGES[toastKey])
    navigateTo({
      path: route.path,
      query: buildTransactionFilterQuery(filters.value),
    }, { replace: true })
  }
})
</script>

<template>
  <div>
    <header class="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div class="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <div class="min-w-0">
          <h1 class="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Daily Transactions
          </h1>
          <p class="text-muted mt-1 truncate">
            {{ dayLabel }}
          </p>
        </div>

        <NuxtLink
          to="/transactions/add"
          class="touch-target inline-flex shrink-0 items-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          Add
        </NuxtLink>
      </div>
    </header>

    <main class="mx-auto max-w-3xl space-y-4 px-4 py-6 sm:px-6">
      <TransactionFilters
        :filters="filters"
        @change="applyFilters"
        @reset="resetFilters"
      />

      <div
        v-if="!isLoading && hasTransactions"
        class="grid grid-cols-3 gap-2 sm:gap-3"
      >
        <div class="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-3 dark:border-emerald-900/50 dark:bg-emerald-950/40">
          <p class="text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
            Income
          </p>
          <p class="mt-1 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            {{ formatRupiah(dailySummary.income) }}
          </p>
        </div>
        <div class="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-3 dark:border-rose-900/50 dark:bg-rose-950/40">
          <p class="text-[11px] font-medium text-rose-700 dark:text-rose-300">
            Outcome
          </p>
          <p class="mt-1 text-sm font-semibold text-rose-700 dark:text-rose-300">
            {{ formatRupiah(dailySummary.outcome) }}
          </p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-900">
          <p class="text-[11px] font-medium text-slate-600 dark:text-slate-400">
            Balance
          </p>
          <p
            class="mt-1 text-sm font-semibold"
            :class="dailySummary.balance >= 0 ? 'text-income' : 'text-outcome'"
          >
            {{ formatRupiah(dailySummary.balance) }}
          </p>
        </div>
      </div>

      <TransactionListSkeleton v-if="isLoading" />

      <div
        v-else-if="fetchErrorMessage"
        class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-6 text-center dark:border-rose-900/50 dark:bg-rose-950/40"
      >
        <p class="text-sm text-rose-700 dark:text-rose-300">
          {{ fetchErrorMessage }}
        </p>
        <button
          type="button"
          class="touch-target mt-4 rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
          @click="refresh()"
        >
          Try again
        </button>
      </div>

      <TransactionEmptyState
        v-else-if="!hasTransactions && !isFiltered"
        @add="navigateTo('/transactions/add')"
      />

      <div
        v-else-if="!hasTransactions && isFiltered"
        class="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900"
      >
        <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">
          No transactions match this filter
        </h2>
        <p class="text-muted mt-2">
          Try changing type or source, or reset the filter.
        </p>
        <button
          type="button"
          class="touch-target mt-5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          @click="resetFilters"
        >
          Reset filter
        </button>
      </div>

      <div
        v-else
        class="space-y-3"
      >
        <p class="text-muted-xs font-medium">
          {{ dailySummary.count }} transaction(s)
        </p>
        <TransactionListItem
          v-for="transaction in transactions"
          :key="transaction.id"
          :transaction="transaction"
          show-time-only
        />
      </div>
    </main>
  </div>
</template>
