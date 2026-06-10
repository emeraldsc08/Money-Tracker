<script setup lang="ts">
import type { ApiResponse } from '~~/shared/types/api'
import type { MonthlySummaryItem } from '~~/shared/types/report'

useHead({ title: 'Monthly Report' })

const { data: months, status, error, refresh } = await useFetch('/api/reports/monthly', {
  key: 'reports-monthly-list',
  transform: (response: ApiResponse<MonthlySummaryItem[]>) => {
    if (!response.success) {
      throw new Error(response.error ?? 'Failed to fetch monthly report list.')
    }
    return response.data ?? []
  },
})

const isLoading = computed(() => status.value === 'pending')
const hasMonths = computed(() => (months.value?.length ?? 0) > 0)
const fetchErrorMessage = computed(() => error.value?.message ?? null)
</script>

<template>
  <div>
    <TransactionBackHeader
      title="Monthly Report"
      subtitle="Monthly transaction summaries"
      back-to="/transactions"
    />

    <main class="mx-auto max-w-3xl space-y-4 px-4 py-6 sm:px-6">
      <ReportMonthlyListSkeleton v-if="isLoading" />

      <div
        v-else-if="fetchErrorMessage"
        class="alert-error rounded-2xl px-4 py-8 text-center"
      >
        <p class="text-sm">
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

      <ReportEmptyState
        v-else-if="!hasMonths"
        title="No monthly summaries yet"
        description="Your recorded transactions will appear here as monthly summaries."
      />

      <MonthlySummaryCard
        v-for="item in months"
        v-else
        :key="`${item.year}-${item.month}`"
        :item="item"
      />
    </main>
  </div>
</template>
