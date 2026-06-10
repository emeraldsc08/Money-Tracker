<script setup lang="ts">
import type { ReportPeriodPreset } from '~~/shared/types/report'

const props = defineProps<{
  preset: ReportPeriodPreset
  customFrom: string
  customTo: string
}>()

const emit = defineEmits<{
  'update:preset': [value: ReportPeriodPreset]
  'update:customFrom': [value: string]
  'update:customTo': [value: string]
}>()

const presets: Array<{ id: ReportPeriodPreset, label: string }> = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This week' },
  { id: 'month', label: 'This month' },
  { id: 'custom', label: 'Custom range' },
]

function selectPreset(id: ReportPeriodPreset) {
  emit('update:preset', id)
}
</script>

<template>
  <div class="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <p class="text-label">
      Period Filter
    </p>

    <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <button
        v-for="item in presets"
        :key="item.id"
        type="button"
        class="touch-target rounded-xl px-3 py-2.5 text-sm font-medium transition"
        :class="preset === item.id
          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'"
        @click="selectPreset(item.id)"
      >
        {{ item.label }}
      </button>
    </div>

    <ClientOnly>
      <div
        v-if="preset === 'custom'"
        class="grid gap-3 sm:grid-cols-2"
      >
        <label class="block space-y-1.5">
          <span class="text-label-sm">From</span>
          <input
            :value="customFrom"
            type="date"
            class="touch-target w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-slate-700"
            @input="emit('update:customFrom', ($event.target as HTMLInputElement).value)"
          >
        </label>
        <label class="block space-y-1.5">
          <span class="text-label-sm">To</span>
          <input
            :value="customTo"
            type="date"
            class="touch-target w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-slate-700"
            @input="emit('update:customTo', ($event.target as HTMLInputElement).value)"
          >
        </label>
      </div>
    </ClientOnly>
  </div>
</template>
