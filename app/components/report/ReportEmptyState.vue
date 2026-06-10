<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900">
    <div
      class="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
      aria-hidden="true"
    >
      <svg
        class="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9 17v-6h6v6M5 7h14v10H5V7z"
        />
      </svg>
    </div>
    <h2 class="text-base font-semibold text-heading">
      {{ title }}
    </h2>
    <p class="text-muted mt-2 max-w-sm">
      {{ description }}
    </p>
  </div>
</template>
