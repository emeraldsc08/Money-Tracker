<template>
  <div class="space-y-3" aria-hidden="true">
    <div
      v-for="index in 5"
      :key="index"
      class="animate-pulse rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="flex items-start justify-between gap-3">
        <div class="flex-1 space-y-2">
          <div class="skeleton-bar h-4 w-2/3 rounded" />
          <div class="skeleton-bar h-3 w-1/2 rounded" />
        </div>
        <div class="skeleton-bar h-4 w-24 rounded" />
      </div>
      <div class="mt-3 flex gap-2">
        <div class="skeleton-bar h-6 w-20 rounded-full" />
        <div class="skeleton-bar h-6 w-16 rounded-full" />
      </div>
    </div>
  </div>
</template>
