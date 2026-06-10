<script setup lang="ts">
import type { ApiResponse } from '~~/shared/types/api'
import type { MonthlyDetailReport } from '~~/shared/types/report'
import { formatRupiah } from '~/utils/format'
import { exportTransactionsCsv } from '~/utils/transaction-csv'

const route = useRoute()
const year = computed(() => route.params.year as string)
const month = computed(() => route.params.month as string)

const { data: report, status, error } = await useFetch(
  () => `/api/reports/monthly/${year.value}/${month.value}`,
  {
    key: () => `reports-monthly-detail-${year.value}-${month.value}`,
    transform: (response: ApiResponse<MonthlyDetailReport>) => {
      if (!response.success || !response.data) {
        throw createError({
          statusCode: 404,
          statusMessage: response.error ?? 'Monthly report not found.',
        })
      }
      return response.data
    },
  },
)

useHead({
  title: computed(() => report.value ? `Report ${report.value.label}` : 'Monthly Detail'),
})

const isLoading = computed(() => status.value === 'pending')
const hasTransactions = computed(() => (report.value?.transactions.length ?? 0) > 0)
const fetchErrorMessage = computed(() => error.value?.message ?? null)

function exportCsv() {
  if (!report.value || report.value.transactions.length === 0) {
    return
  }

  exportTransactionsCsv(
    report.value.transactions,
    report.value.year,
    report.value.month,
  )
}
</script>

<template>
  <div>
    <div
      v-if="isLoading"
      class="mx-auto max-w-5xl px-4 py-6 sm:px-6"
    >
      <ReportMonthlyDetailSkeleton />
    </div>

    <div
      v-else-if="fetchErrorMessage"
      class="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6"
    >
      <p class="text-sm text-outcome">
        {{ fetchErrorMessage }}
      </p>
      <NuxtLink
        to="/reports/monthly"
        class="touch-target mt-4 inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white dark:bg-slate-100 dark:text-slate-900"
      >
        Back to Monthly Report
      </NuxtLink>
    </div>

    <template v-else-if="report">
      <TransactionBackHeader
        :title="report.label"
        :subtitle="`Income ${formatRupiah(report.summary.totalIncome)} · Outcome ${formatRupiah(report.summary.totalOutcome)}`"
        back-to="/reports/monthly"
      />

      <main class="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6">
        <ReportSummaryCards :summary="report.summary" />

        <ReportEmptyState
          v-if="!hasTransactions"
          title="No data for this month"
          description="No transactions were recorded for this period. Try another month or add a new transaction."
        />

        <template v-else>
          <div class="grid gap-5 lg:grid-cols-2">
            <MonthlyCategoryBreakdown
              title="Breakdown Income per Category"
              :items="report.incomeByCategory"
              variant="income"
            />
            <MonthlyCategoryBreakdown
              title="Breakdown Outcome per Category"
              :items="report.outcomeByCategory"
              variant="outcome"
            />
          </div>

          <MonthlyTransactionTable :transactions="report.transactions">
            <template #actions>
              <button
                type="button"
                class="touch-target inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                @click="exportCsv"
              >
                <svg
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                  />
                </svg>
                Export CSV
              </button>
            </template>
          </MonthlyTransactionTable>
        </template>
      </main>
    </template>
  </div>
</template>
