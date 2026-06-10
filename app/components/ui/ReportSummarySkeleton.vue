<template>
  <div
    class="grid animate-pulse gap-3 sm:grid-cols-3"
    aria-hidden="true"
  >
    <div
      v-for="index in 3"
      :key="index"
      class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="h-3 w-24 rounded bg-slate-200" />
      <div class="mt-3 h-7 w-32 rounded bg-slate-200" />
    </div>
  </div>
</template>
