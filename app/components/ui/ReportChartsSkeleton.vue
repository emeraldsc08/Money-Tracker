<template>
  <div
    class="grid animate-pulse gap-5 lg:grid-cols-2"
    aria-hidden="true"
  >
    <div
      v-for="index in 2"
      :key="index"
      class="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="h-5 w-48 rounded bg-slate-200" />
      <div class="mx-auto mt-6 h-48 w-48 rounded-full bg-slate-200" />
      <div class="mt-6 space-y-2">
        <div class="h-3 w-full rounded bg-slate-200" />
        <div class="h-3 w-4/5 rounded bg-slate-200" />
      </div>
    </div>
  </div>
</template>
