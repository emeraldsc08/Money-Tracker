<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  backTo: string
}>()
</script>

<template>
  <header class="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
    <div class="mx-auto max-w-3xl px-4 py-4 sm:px-6">
      <NuxtLink
        :to="backTo"
        class="touch-target mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </NuxtLink>

      <div>
        <h1 class="text-xl font-semibold text-heading">
          {{ title }}
        </h1>
        <p
          v-if="subtitle"
          class="text-muted mt-1"
        >
          {{ subtitle }}
        </p>
      </div>
    </div>
  </header>
</template>
