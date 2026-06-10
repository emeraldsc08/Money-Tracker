<script setup lang="ts">
import type { RealtimeReportSummary } from '~~/shared/types/report'
import { formatRupiah } from '~/utils/format'

defineProps<{
  summary: RealtimeReportSummary
}>()
</script>

<template>
  <div class="grid gap-3 sm:grid-cols-3">
    <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/40">
      <p class="text-sm font-medium text-income">
        Total Income
      </p>
      <p class="mt-2 text-xl font-bold text-emerald-800 dark:text-emerald-200 sm:text-2xl">
        {{ formatRupiah(summary.totalIncome) }}
      </p>
    </div>

    <div class="rounded-2xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900/50 dark:bg-rose-950/40">
      <p class="text-sm font-medium text-outcome">
        Total Outcome
      </p>
      <p class="mt-2 text-xl font-bold text-rose-800 dark:text-rose-200 sm:text-2xl">
        {{ formatRupiah(summary.totalOutcome) }}
      </p>
    </div>

    <div class="surface-card p-4 sm:col-span-1">
      <p class="text-label-sm">
        Selisih (Balance)
      </p>
      <p
        class="mt-2 text-xl font-bold sm:text-2xl"
        :class="summary.balance >= 0 ? 'text-income' : 'text-outcome'"
      >
        {{ formatRupiah(summary.balance) }}
      </p>
    </div>
  </div>
</template>
