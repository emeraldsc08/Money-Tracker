<template>
  <div
    class="space-y-5"
    aria-hidden="true"
  >
    <ReportSummarySkeleton />

    <div class="grid animate-pulse gap-5 lg:grid-cols-2">
      <div
        v-for="index in 2"
        :key="index"
        class="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
      >
        <div class="h-5 w-56 rounded bg-slate-200" />
        <div class="mt-4 space-y-3">
          <div
            v-for="row in 3"
            :key="row"
            class="h-8 rounded bg-slate-200"
          />
        </div>
      </div>
    </div>

    <div class="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div class="h-5 w-40 rounded bg-slate-200" />
      <div class="mt-4 space-y-3">
        <div
          v-for="row in 4"
          :key="row"
          class="h-10 rounded bg-slate-200"
        />
      </div>
    </div>
  </div>
</template>
