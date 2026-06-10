<script setup lang="ts">
import type { CategoryBreakdownItem } from '~~/shared/types/report'
import { formatRupiah } from '~/utils/format'

defineProps<{
  title: string
  items: CategoryBreakdownItem[]
  variant: 'income' | 'outcome'
}>()
</script>

<template>
  <div class="surface-card p-4 sm:p-5">
    <h2 class="text-base font-semibold text-heading">
      {{ title }}
    </h2>

    <div
      v-if="items.length === 0"
      class="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400"
    >
      No category data.
    </div>

    <div
      v-else
      class="mt-4 space-y-3"
    >
      <div
        v-for="item in items"
        :key="item.category"
        class="space-y-1.5"
      >
        <div class="flex items-center justify-between gap-3 text-sm">
          <span class="font-medium text-slate-700 dark:text-slate-300">{{ item.category }}</span>
          <span
            class="font-semibold"
            :class="variant === 'income' ? 'text-income' : 'text-outcome'"
          >
            {{ formatRupiah(item.amount) }} ({{ item.percentage }}%)
          </span>
        </div>
        <div class="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            class="h-full rounded-full transition-all"
            :class="variant === 'income' ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-rose-500 dark:bg-rose-400'"
            :style="{ width: `${Math.min(item.percentage, 100)}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
