<script setup lang="ts">
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from 'chart.js'
import { Pie } from 'vue-chartjs'
import { getChartColors } from '~/utils/chart-colors'
import { formatRupiah } from '~/utils/format'

import type { PieChartItem } from '~~/shared/types/report'

const props = defineProps<{
  items: PieChartItem[]
  variant: 'income' | 'outcome'
}>()

ChartJS.register(ArcElement, Tooltip, Legend)

const isCompact = ref(false)
const isDark = ref(false)

const hasData = computed(() => props.items.length > 0)

const chartColors = computed(() => getChartColors(props.items.length))

const chartData = computed(() => ({
  labels: props.items.map(item => `${item.label} (${item.percentage}%)`),
  datasets: [
    {
      data: props.items.map(item => item.amount),
      backgroundColor: chartColors.value,
      borderWidth: 2,
      borderColor: isDark.value ? '#0f172a' : '#ffffff',
      hoverBorderWidth: 3,
      hoverOffset: 6,
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: isCompact.value ? 1.1 : 1.4,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        boxWidth: 12,
        boxHeight: 12,
        padding: 12,
        color: isDark.value ? '#cbd5e1' : '#475569',
        font: {
          size: isCompact.value ? 11 : 12,
        },
      },
    },
    tooltip: {
      callbacks: {
        label: (context: { dataIndex: number }) => {
          const item = props.items[context.dataIndex]
          if (!item) {
            return ''
          }
          return `${item.label}: ${formatRupiah(item.amount)} (${item.percentage}%)`
        },
      },
    },
  },
}))

function updateLayoutState() {
  isCompact.value = window.innerWidth < 640
  isDark.value = document.documentElement.classList.contains('dark')
}

let themeObserver: MutationObserver | null = null

onMounted(() => {
  updateLayoutState()
  window.addEventListener('resize', updateLayoutState)

  themeObserver = new MutationObserver(updateLayoutState)
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', updateLayoutState)
  themeObserver?.disconnect()
})
</script>

<template>
  <div>
    <div
      v-if="hasData"
      class="relative mx-auto h-[280px] w-full max-w-md sm:h-[320px]"
    >
      <Pie
        :data="chartData"
        :options="chartOptions"
      />
    </div>

    <div
      v-else
      class="flex min-h-[240px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400"
    >
      No data for this filter.
    </div>
  </div>
</template>
