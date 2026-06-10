<script setup lang="ts">
const props = defineProps<{
  type: 'INCOME' | 'OUTCOME'
  title: string
  description: string
  to: string
}>()

const isIncome = computed(() => props.type === 'INCOME')
</script>

<template>
  <NuxtLink
    :to="to"
    class="touch-target group flex min-h-[180px] flex-col items-center justify-center rounded-2xl border-2 p-8 text-center transition active:scale-[0.98]"
    :class="isIncome
      ? 'border-emerald-200 bg-emerald-50 hover:border-emerald-400 hover:bg-emerald-100/80 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/60'
      : 'border-rose-200 bg-rose-50 hover:border-rose-400 hover:bg-rose-100/80 dark:border-rose-900/50 dark:bg-rose-950/40 dark:hover:border-rose-700 dark:hover:bg-rose-950/60'"
  >
    <div
      class="mb-5 flex h-20 w-20 items-center justify-center rounded-full transition group-hover:scale-105"
      :class="isIncome
        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400'
        : 'bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400'"
      aria-hidden="true"
    >
      <svg
        v-if="isIncome"
        class="h-10 w-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.75"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 4v16m8-8H4"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M7 17l5-5 5 5"
        />
      </svg>
      <svg
        v-else
        class="h-10 w-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.75"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 20V4m-8 8h16"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M7 7l5 5 5-5"
        />
      </svg>
    </div>

    <h2
      class="text-2xl font-bold"
      :class="isIncome ? 'text-income' : 'text-outcome'"
    >
      {{ title }}
    </h2>
    <p
      class="mt-2 max-w-xs text-sm"
      :class="isIncome ? 'text-emerald-600/80 dark:text-emerald-300/80' : 'text-rose-600/80 dark:text-rose-300/80'"
    >
      {{ description }}
    </p>
  </NuxtLink>
</template>
