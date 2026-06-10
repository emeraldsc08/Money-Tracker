<script setup lang="ts">
import type { MonthlySummaryItem } from '~~/shared/types/report'
import { formatRupiah } from '~/utils/format'

const props = defineProps<{
  item: MonthlySummaryItem
}>()

const detailPath = computed(() => `/reports/monthly/${props.item.year}/${props.item.month}`)
</script>

<template>
  <NuxtLink
    :to="detailPath"
    class="touch-target surface-card block p-5 transition hover:border-slate-300 hover:shadow-sm dark:hover:border-slate-600"
  >
    <div class="flex items-start justify-between gap-3">
      <h2 class="text-lg font-semibold capitalize text-heading">
        {{ item.label }}
      </h2>
      <span class="text-slate-400 dark:text-slate-500" aria-hidden="true">›</span>
    </div>

    <div class="mt-3 space-y-1 text-sm text-slate-600 dark:text-slate-400">
      <p>
        <span class="font-medium text-income">Income:</span>
        {{ formatRupiah(item.summary.totalIncome) }}
      </p>
      <p>
        <span class="font-medium text-outcome">Outcome:</span>
        {{ formatRupiah(item.summary.totalOutcome) }}
      </p>
      <p>
        <span
          class="font-medium"
          :class="item.summary.balance >= 0 ? 'text-income' : 'text-outcome'"
        >
          Sisa:
        </span>
        {{ formatRupiah(item.summary.balance) }}
      </p>
    </div>
  </NuxtLink>
</template>
