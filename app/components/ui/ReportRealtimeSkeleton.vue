<template>
  <div
    class="animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
    aria-hidden="true"
  >
    <div class="space-y-4 border-b border-slate-200 p-5 dark:border-slate-800">
      <div class="h-5 w-40 rounded bg-slate-200 dark:bg-slate-700" />
      <div class="h-4 w-64 rounded bg-slate-200 dark:bg-slate-700" />
      <div class="grid gap-2 sm:grid-cols-3">
        <div
          v-for="index in 3"
          :key="index"
          class="h-16 rounded-xl bg-slate-200 dark:bg-slate-700"
        />
      </div>
    </div>
    <div class="space-y-4 p-5">
      <div class="grid grid-cols-2 gap-2">
        <div class="h-11 rounded-xl bg-slate-200 dark:bg-slate-700" />
        <div class="h-11 rounded-xl bg-slate-200 dark:bg-slate-700" />
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div class="h-11 rounded-xl bg-slate-200 dark:bg-slate-700" />
        <div class="h-11 rounded-xl bg-slate-200 dark:bg-slate-700" />
      </div>
      <div class="mx-auto h-56 w-56 rounded-full bg-slate-200 dark:bg-slate-700" />
    </div>
  </div>
</template>
