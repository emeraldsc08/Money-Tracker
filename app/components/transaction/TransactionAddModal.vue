<script setup lang="ts">
const emit = defineEmits<{
  success: []
}>()

const { isFormOpen, selectedType, closeAddFlow, backToTypePicker } = useAddTransaction()

const title = computed(() =>
  selectedType.value === 'INCOME' ? 'Add Income' : 'Add Outcome',
)
const subtitle = computed(() =>
  selectedType.value === 'INCOME'
    ? 'Record new income'
    : 'Record new expense',
)

function onSuccess() {
  emit('success')
  closeAddFlow()
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isFormOpen && selectedType"
      class="fixed inset-0 z-[60] flex flex-col bg-slate-900/50 sm:items-center sm:justify-center sm:p-4"
    >
      <div
        class="flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-white dark:bg-slate-900 sm:max-h-[92dvh] sm:max-w-lg sm:flex-none sm:rounded-2xl sm:shadow-xl"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        style="padding-bottom: env(safe-area-inset-bottom, 0px);"
      >
        <header class="shrink-0 border-b border-slate-200 px-4 py-4 dark:border-slate-800 sm:px-5">
          <div class="flex items-start gap-3">
            <button
              type="button"
              class="touch-target mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              aria-label="Back to type selection"
              @click="backToTypePicker"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div class="min-w-0 flex-1">
              <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {{ title }}
              </h2>
              <p class="text-muted mt-0.5">
                {{ subtitle }}
              </p>
            </div>

            <button
              type="button"
              class="touch-target flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              aria-label="Close"
              @click="closeAddFlow"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </header>

        <div class="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
          <TransactionForm
            :key="selectedType"
            :type="selectedType"
            mode="modal"
            bare
            @cancel="closeAddFlow"
            @success="onSuccess"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>
