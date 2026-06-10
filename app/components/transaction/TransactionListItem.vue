<script setup lang="ts">
import type { SerializedTransaction } from '~~/shared/types/transaction'
import { formatSignedRupiah, formatTransactionDate, formatTransactionTime } from '~/utils/format'

const props = withDefaults(defineProps<{
  transaction: SerializedTransaction
  showTimeOnly?: boolean
}>(), {
  showTimeOnly: false,
})

const isIncome = computed(() => props.transaction.type === 'INCOME')
const amountLabel = computed(() => formatSignedRupiah(props.transaction.amount, props.transaction.type))
const editPath = computed(() => `/transactions/${props.transaction.id}/edit`)
</script>

<template>
  <NuxtLink
    :to="editPath"
    class="touch-target flex w-full items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4 text-left transition hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
  >
    <div class="min-w-0 flex-1">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="truncate font-medium text-slate-900 dark:text-slate-100">
            {{ transaction.title }}
          </p>
          <p class="text-muted mt-1">
            {{ showTimeOnly ? formatTransactionTime(transaction.date) : formatTransactionDate(transaction.date) }}
          </p>
        </div>
        <p
          class="shrink-0 text-sm font-semibold"
          :class="isIncome ? 'text-emerald-600' : 'text-rose-600'"
        >
          {{ amountLabel }}
        </p>
      </div>

      <div class="mt-3 flex flex-wrap gap-2">
        <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {{ transaction.category }}
        </span>
        <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {{ transaction.source }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
