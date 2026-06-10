<script setup lang="ts">
const emit = defineEmits<{
  add: []
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
    <div
      class="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50"
      aria-hidden="true"
    >
      <svg
        class="h-12 w-12 text-emerald-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 6v12m6-6H6M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>

    <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
      No transactions for this day
    </h2>
    <p class="text-muted mt-2 max-w-sm">
      Add income or expenses for the selected date.
    </p>

    <button
      type="button"
      class="touch-target mt-6 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
      @click="emit('add')"
    >
      Add Transaction
    </button>
  </div>
</template>
