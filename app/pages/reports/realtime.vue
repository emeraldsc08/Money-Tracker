<script setup lang="ts">
import type { ApiResponse } from '~~/shared/types/api'
import type { RealtimeReportData, ReportPeriodPreset } from '~~/shared/types/report'
import { getCustomDateRange, getPresetDateRange } from '~~/shared/utils/report-period'
import { getJakartaYmd } from '~~/shared/utils/jakarta-date'

useHead({ title: 'Realtime Report' })

const selectedPreset = ref<ReportPeriodPreset>('month')
const customFrom = ref('')
const customTo = ref('')
const customDatesReady = ref(false)

const formatYmd = (year: number, month: number, day: number) =>
  `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

onMounted(() => {
  const todayParts = getJakartaYmd(new Date())
  customFrom.value = formatYmd(todayParts.year, todayParts.month, 1)
  customTo.value = formatYmd(todayParts.year, todayParts.month, todayParts.day)
  customDatesReady.value = true
})

const dateRange = computed(() => {
  if (selectedPreset.value === 'custom') {
    if (!customDatesReady.value) {
      return getPresetDateRange('month')
    }

    return getCustomDateRange(customFrom.value, customTo.value)
      ?? getPresetDateRange('month')
  }

  return getPresetDateRange(selectedPreset.value)
})

const customRangeError = computed(() => {
  if (selectedPreset.value !== 'custom' || !customDatesReady.value) {
    return null
  }

  return getCustomDateRange(customFrom.value, customTo.value)
    ? null
    : 'Custom date range is invalid.'
})

const { data: report, status, error, refresh } = await useFetch('/api/reports/realtime', {
  key: 'reports-realtime',
  query: computed(() => ({
    from: dateRange.value.from,
    to: dateRange.value.to,
  })),
  transform: (response: ApiResponse<RealtimeReportData>) => {
    if (!response.success || !response.data) {
      throw new Error(response.error ?? 'Failed to fetch realtime report.')
    }
    return response.data
  },
})

const isLoading = computed(() => status.value === 'pending')
const fetchErrorMessage = computed(() => error.value?.message ?? null)
</script>

<template>
  <div>
    <TransactionBackHeader
      title="Realtime Report"
      subtitle="Transaction summary and distribution"
      back-to="/transactions"
    />

    <main class="mx-auto max-w-3xl space-y-5 px-4 py-6 sm:px-6">
      <ReportPeriodFilter
        :preset="selectedPreset"
        :custom-from="customFrom"
        :custom-to="customTo"
        @update:preset="selectedPreset = $event"
        @update:custom-from="customFrom = $event"
        @update:custom-to="customTo = $event"
      />

      <p
        v-if="customRangeError"
        class="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
      >
        {{ customRangeError }}
      </p>

      <ReportRealtimeSkeleton v-if="isLoading" />

      <div
        v-else-if="fetchErrorMessage"
        class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-8 text-center dark:border-rose-900/50 dark:bg-rose-950/40"
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

      <RealtimeDistributionCard
        v-else-if="report"
        :report="report"
      />
    </main>
  </div>
</template>
