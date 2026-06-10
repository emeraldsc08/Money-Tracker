<script setup lang="ts">
import type {
  CategoryBreakdownItem,
  RealtimeReportData,
  SourceBreakdownItem,
} from '~~/shared/types/report'
import type { PieChartItem } from '~~/shared/types/report'
import { getChartColors } from '~/utils/chart-colors'
import { formatRupiah } from '~/utils/format'

const props = defineProps<{
  report: RealtimeReportData
}>()

type DistributionType = 'income' | 'outcome'
type DistributionDimension = 'source' | 'category'

const selectedType = ref<DistributionType>('income')
const selectedDimension = ref<DistributionDimension>('source')

const typeOptions: Array<{ id: DistributionType, label: string }> = [
  { id: 'income', label: 'Income' },
  { id: 'outcome', label: 'Outcome' },
]

const dimensionOptions: Array<{ id: DistributionDimension, label: string }> = [
  { id: 'source', label: 'Source' },
  { id: 'category', label: 'Category' },
]

function toPieItemsFromSource(items: SourceBreakdownItem[]): PieChartItem[] {
  return items.map(item => ({
    label: item.source,
    amount: item.amount,
    percentage: item.percentage,
  }))
}

function toPieItemsFromCategory(items: CategoryBreakdownItem[]): PieChartItem[] {
  return items.map(item => ({
    label: item.category,
    amount: item.amount,
    percentage: item.percentage,
  }))
}

const chartItems = computed<PieChartItem[]>(() => {
  if (selectedType.value === 'income') {
    return selectedDimension.value === 'source'
      ? toPieItemsFromSource(props.report.incomeBySource)
      : toPieItemsFromCategory(props.report.incomeByCategory)
  }

  return selectedDimension.value === 'source'
    ? toPieItemsFromSource(props.report.outcomeBySource)
    : toPieItemsFromCategory(props.report.outcomeByCategory)
})

const chartTitle = computed(() => {
  const typeLabel = selectedType.value === 'income' ? 'Income' : 'Outcome'
  const dimensionLabel = selectedDimension.value === 'source' ? 'Source' : 'Category'
  return `${typeLabel} distribution by ${dimensionLabel}`
})

const activeTotal = computed(() =>
  selectedType.value === 'income'
    ? props.report.summary.totalIncome
    : props.report.summary.totalOutcome,
)

const chartColors = computed(() => getChartColors(chartItems.value.length))
</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
    <div class="border-b border-slate-200 p-4 sm:p-5 dark:border-slate-800">
      <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100 sm:text-lg">
        Realtime Report
      </h2>
      <p class="text-muted mt-1">
        Summary and distribution for the selected period
      </p>

      <div class="mt-4 grid gap-2 sm:grid-cols-3">
        <div class="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 dark:border-emerald-900/50 dark:bg-emerald-950/40">
          <p class="text-xs font-medium text-emerald-700 dark:text-emerald-300">
            Total Income
          </p>
          <p class="mt-1 text-lg font-bold text-emerald-800 dark:text-emerald-200">
            {{ formatRupiah(report.summary.totalIncome) }}
          </p>
        </div>
        <div class="rounded-xl border border-rose-200 bg-rose-50 px-3 py-3 dark:border-rose-900/50 dark:bg-rose-950/40">
          <p class="text-xs font-medium text-rose-700 dark:text-rose-300">
            Total Outcome
          </p>
          <p class="mt-1 text-lg font-bold text-rose-800 dark:text-rose-200">
            {{ formatRupiah(report.summary.totalOutcome) }}
          </p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-700 dark:bg-slate-800/60">
          <p class="text-xs font-medium text-slate-600 dark:text-slate-400">
            Balance
          </p>
          <p
            class="mt-1 text-lg font-bold"
            :class="report.summary.balance >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'"
          >
            {{ formatRupiah(report.summary.balance) }}
          </p>
        </div>
      </div>
    </div>

    <div class="space-y-4 p-4 sm:p-5">
      <div class="space-y-3">
        <div class="space-y-1.5">
          <span class="text-xs font-medium text-slate-600 dark:text-slate-400">Transaction type</span>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="option in typeOptions"
              :key="option.id"
              type="button"
              class="touch-target rounded-xl px-3 py-2.5 text-sm font-medium transition"
              :class="selectedType === option.id
                ? option.id === 'income'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rose-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'"
              @click="selectedType = option.id"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <div class="space-y-1.5">
          <span class="text-xs font-medium text-slate-600 dark:text-slate-400">Group by</span>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="option in dimensionOptions"
              :key="option.id"
              type="button"
              class="touch-target rounded-xl px-3 py-2.5 text-sm font-medium transition"
              :class="selectedDimension === option.id
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'"
              @click="selectedDimension = option.id"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-800/40">
        <div class="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {{ chartTitle }}
            </h3>
            <p class="text-muted-xs mt-0.5">
              Total: {{ formatRupiah(activeTotal) }}
            </p>
          </div>
          <p class="text-muted-xs">
            {{ chartItems.length }} item
          </p>
        </div>

        <ReportPieChart
          :items="chartItems"
          :variant="selectedType"
        />
      </div>

      <div
        v-if="chartItems.length > 0"
        class="space-y-2"
      >
        <p class="text-xs font-medium text-slate-600 dark:text-slate-400">
          Breakdown
        </p>
        <div class="space-y-2">
          <div
            v-for="(item, index) in chartItems"
            :key="item.label"
            class="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900"
          >
            <div class="flex min-w-0 items-center gap-2">
              <span
                class="h-3 w-3 shrink-0 rounded-full"
                :style="{ backgroundColor: chartColors[index] }"
              />
              <span class="truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                {{ item.label }}
              </span>
            </div>
            <span
              class="shrink-0 text-sm font-semibold"
              :class="selectedType === 'income' ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'"
            >
              {{ formatRupiah(item.amount) }} ({{ item.percentage }}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
