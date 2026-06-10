<script setup lang="ts">
import { DEFAULT_SOURCES } from '~~/shared/constants/transaction-options'
import { formatDayLabel } from '~/utils/format'
import {
  getAdjacentTransactionDate,
  getDefaultTransactionDate,
  isDefaultTransactionDate,
  type TransactionFilterState,
  type TransactionTypeFilter,
} from '~/utils/transaction-filters'

const props = defineProps<{
  filters: TransactionFilterState
}>()

const emit = defineEmits<{
  change: [filters: TransactionFilterState]
  reset: []
}>()

const typeOptions: Array<{ id: TransactionTypeFilter, label: string }> = [
  { id: 'all', label: 'Semua' },
  { id: 'INCOME', label: 'Masuk' },
  { id: 'OUTCOME', label: 'Keluar' },
]

const dayLabel = computed(() => formatDayLabel(props.filters.date))
const canGoNext = computed(() => !isDefaultTransactionDate(props.filters.date))
const previousDate = computed(() => getAdjacentTransactionDate(props.filters.date, -1))
const nextDate = computed(() => getAdjacentTransactionDate(props.filters.date, 1))

function updateType(type: TransactionTypeFilter) {
  emit('change', { ...props.filters, type })
}

function updateSource(source: string) {
  emit('change', { ...props.filters, source })
}

function updateDate(date: string) {
  emit('change', { ...props.filters, date })
}

function goToPreviousDay() {
  if (previousDate.value) {
    updateDate(previousDate.value)
  }
}

function goToNextDay() {
  if (nextDate.value) {
    updateDate(nextDate.value)
  }
}

function goToToday() {
  updateDate(getDefaultTransactionDate())
}
</script>

<template>
  <div class="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-sm font-medium text-slate-700 dark:text-slate-300">
          Filter Harian
        </p>
        <p class="text-muted-xs mt-0.5">
          {{ dayLabel }}
        </p>
      </div>
      <button
        type="button"
        class="touch-target text-sm font-medium text-slate-500 transition hover:text-slate-800 dark:hover:text-slate-200"
        @click="emit('reset')"
      >
        Reset
      </button>
    </div>

    <div class="space-y-2">
      <span class="text-xs font-medium text-slate-600 dark:text-slate-400">Tanggal</span>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="touch-target inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          aria-label="Hari sebelumnya"
          @click="goToPreviousDay"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <input
          :value="filters.date"
          type="date"
          class="touch-target min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-slate-700"
          @input="updateDate(($event.target as HTMLInputElement).value)"
        >

        <button
          type="button"
          class="touch-target inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          aria-label="Hari berikutnya"
          :disabled="!canGoNext || !nextDate"
          @click="goToNextDay"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <button
        v-if="!isDefaultTransactionDate(filters.date)"
        type="button"
        class="touch-target w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        @click="goToToday"
      >
        Kembali ke hari ini
      </button>
    </div>

    <div class="space-y-1.5">
      <span class="text-xs font-medium text-slate-600 dark:text-slate-400">Tipe</span>
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="option in typeOptions"
          :key="option.id"
          type="button"
          class="touch-target rounded-xl px-3 py-2.5 text-sm font-medium transition"
          :class="filters.type === option.id
            ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'"
          @click="updateType(option.id)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <label class="block space-y-1.5">
      <span class="text-xs font-medium text-slate-600 dark:text-slate-400">Sumber</span>
      <select
        :value="filters.source"
        class="touch-target w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-slate-700"
        @change="updateSource(($event.target as HTMLSelectElement).value)"
      >
        <option value="all">
          Semua sumber
        </option>
        <option
          v-for="source in DEFAULT_SOURCES"
          :key="source"
          :value="source"
        >
          {{ source }}
        </option>
      </select>
    </label>
  </div>
</template>
