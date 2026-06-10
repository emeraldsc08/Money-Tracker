<template>
  <div
    class="space-y-4"
    aria-hidden="true"
  >
    <div
      v-for="index in 3"
      :key="index"
      class="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="h-5 w-32 rounded bg-slate-200" />
      <div class="mt-4 h-4 w-full rounded bg-slate-200" />
      <div class="mt-2 h-4 w-4/5 rounded bg-slate-200" />
    </div>
  </div>
</template>
